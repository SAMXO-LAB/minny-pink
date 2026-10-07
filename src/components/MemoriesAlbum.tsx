"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Section from "./ui/Section";
import Modal from "./ui/Modal";
import LockPanel from "./ui/LockPanel";
import { Rich } from "./Icons";
import { MEMORY_ITEMS, MemoryItem } from "@/lib/content";
import { SITE } from "@/lib/config";
import { music } from "@/lib/music";
import { lockScroll, unlockScroll } from "@/lib/scroll";
import { useAvatar } from "./AvatarProvider";

const SONG = "/audio/perfect.mp3";
const NOTE = "/audio/love-note.mp3";
const IMAGE_MS = 4000;
const STAGE_W = "min(92vw, 980px, calc(68vh * 1.7778))";

const fit = (m: MemoryItem) => (m.portrait ? "object-contain" : "object-cover");

const PlayBadge = ({ size = "h-12 w-12" }: { size?: string }) => (
  <span aria-hidden="true" className={`absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-hot shadow-lg backdrop-blur ${size}`}>
    <svg viewBox="0 0 24 24" className="ml-0.5 h-1/2 w-1/2" fill="currentColor"><path d="M7 4.500v15l13-7.500z" /></svg>
  </span>
);

/** Pause the background song while something else makes sound, then bring it back. */
function useDuckMusic() {
  const was = useRef(false);
  const duck = useCallback(() => {
    if (music?.playing) {
      was.current = true;
      music.stop();
    }
  }, []);
  const restore = useCallback(() => {
    if (was.current) {
      was.current = false;
      music?.start();
    }
  }, []);
  return useMemo(() => ({ duck, restore }), [duck, restore]);
}

/* ───────────── "Play Our Movie": photos + clips as an auto-advancing film ───────────── */
function Movie({ items, song, onClose }: { items: MemoryItem[]; song: HTMLAudioElement | null; onClose: () => void }) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const item = items[i];

  const next = useCallback(() => setI((n) => (n + 1) % items.length), [items.length]);

  useEffect(() => {
    lockScroll();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [onClose]);

  // images advance on a timer; videos advance when they end
  useEffect(() => {
    if (!playing || item.type !== "image") return;
    const t = setTimeout(next, IMAGE_MS);
    return () => clearTimeout(t);
  }, [i, playing, item.type, next]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) v.play().catch(() => {});
    else v.pause();
  }, [playing, i]);

  useEffect(() => {
    if (!song) return;
    if (playing) song.play().catch(() => {});
    else song.pause();
  }, [playing, song]);

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Our movie"
      className="fixed inset-0 z-[84] flex flex-col items-center justify-center gap-4 px-4 py-5"
      style={{ background: "radial-gradient(ellipse at 50% 30%, #7a1f55 0%, #3a0f2e 70%, #240a1d 100%)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative aspect-video overflow-hidden rounded-[1.4rem] bg-black shadow-[0_0_80px_rgba(255,77,148,.45)] ring-2 ring-white/30 sm:rounded-[1.8rem]" style={{ width: STAGE_W }}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div key={i} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            {item.type === "image" ? (
              <motion.div className="absolute inset-0" initial={{ scale: 1 }} animate={{ scale: 1.09 }} transition={{ duration: IMAGE_MS / 1000 + 0.6, ease: "linear" }}>
                <Image src={item.src} alt="A memory of us" fill sizes="(max-width:1024px) 92vw, 980px" priority className="object-cover" />
              </motion.div>
            ) : (
              <video ref={videoRef} src={item.src} muted playsInline autoPlay onEnded={next} className={`absolute inset-0 h-full w-full ${fit(item)}`} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex w-full max-w-md gap-1" aria-hidden="true" >
        {items.map((_, n) => (
          <span key={n} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${n < i ? "bg-white" : n === i ? "bg-hot" : "bg-white/25"}`} />
        ))}
      </div>

      <div className="flex gap-3">
        <button type="button" className="btn-soft !min-h-11" onClick={() => setPlaying((p) => !p)}>
          {playing ? "Pause" : "Resume"}
        </button>
        <button type="button" className="btn-glow !min-h-11 !px-7 !text-base" onClick={onClose}>
          Close
        </button>
      </div>
    </motion.div>,
    document.body,
  );
}

/* ───────────── album ───────────── */
export default function MemoriesAlbum() {
  const items = MEMORY_ITEMS;
  const [open, setOpen] = useState<number | null>(null);
  const [movie, setMovie] = useState(false);
  const songRef = useRef<HTMLAudioElement | null>(null);
  const { react } = useAvatar();
  const movieDuck = useDuckMusic();
  const noteDuck = useDuckMusic();
  const lightDuck = useDuckMusic();
  const tilts = [-2.2, 1.6, -1.2, 2.2, -1.8, 1.3];

  const startMovie = () => {
    // created inside the click so the browser lets the song start
    if (!songRef.current) {
      songRef.current = new Audio(SONG);
      songRef.current.loop = true;
    }
    songRef.current.currentTime = 0;
    movieDuck.duck();
    setMovie(true);
    react("love", 4000, "Our little movie 💗");
  };
  const closeMovie = useCallback(() => {
    songRef.current?.pause();
    setMovie(false);
    movieDuck.restore();
  }, [movieDuck]);

  useEffect(() => () => songRef.current?.pause(), []);

  const cur = open !== null ? items[open] : null;

  // ← / → in the lightbox, and bring the background song back when it closes
  useEffect(() => {
    if (open === null) {
      lightDuck.restore();
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setOpen((o) => (o === null ? o : (o + 1) % items.length));
      if (e.key === "ArrowLeft") setOpen((o) => (o === null ? o : (o + items.length - 1) % items.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, items.length, lightDuck]);

  return (
    <Section id="gallery" eyebrow="just between us" title="Our Memories 📸" subtitle="Our photos and clips — tap one to open it, or let them play together like a little movie.">
      {SITE.memoryPassword && (
        <p className="sr-only">This album is password protected.</p>
      )}
      <LockPanel password={SITE.memoryPassword} message="Enter the password to open our album.">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8">
          <div className="glass glow-ring flex w-full max-w-lg flex-col items-center gap-3 rounded-[1.8rem] px-5 py-5 text-center">
            <p className="font-bold text-deep"><Rich>🎧 A little something to listen to</Rich></p>
            <audio
              controls
              preload="none"
              src={NOTE}
              className="w-full"
              onPlay={noteDuck.duck}
              onPause={noteDuck.restore}
              onEnded={noteDuck.restore}
            >
              Your browser doesn&rsquo;t support audio playback.
            </audio>
          </div>

          <button type="button" onClick={startMovie} className="btn-glow !px-9 !text-lg" style={{ animation: "pulse-glow 2.6s ease-in-out infinite" }}>
            ▶ Play Our Movie
          </button>

          <div className="grid w-full grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {items.map((m, i) => (
              <motion.div
                key={m.src}
                initial={{ opacity: 0, y: 40, rotate: tilts[i % 6] * 2 }}
                whileInView={{ opacity: 1, y: 0, rotate: tilts[i % 6] }}
                viewport={{ once: true, margin: "-6%" }}
                transition={{ type: "spring", stiffness: 90, damping: 15, delay: (i % 4) * 0.08 }}
                whileHover={{ rotate: 0, y: -6, scale: 1.03 }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setOpen(i);
                    react("happy", 2000, "Good times 💗");
                  }}
                  aria-label={`Open ${m.type === "video" ? "clip" : "photo"} ${i + 1} of ${items.length}`}
                  className="glass glow-ring group block w-full rounded-[1.4rem] p-2 transition-shadow duration-500 hover:shadow-[0_0_44px_rgba(255,77,148,.5)] sm:p-2.5"
                >
                  <span className="relative block aspect-video overflow-hidden rounded-[1.05rem] bg-gradient-to-br from-[#5a1840] to-[#2a0a22]">
                    {m.type === "image" ? (
                      <Image src={m.src} alt="A memory of us" fill sizes="(max-width:1024px) 45vw, 24vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <>
                        <video src={`${m.src}#t=0.5`} muted playsInline preload="metadata" className={`absolute inset-0 h-full w-full ${fit(m)} transition-transform duration-700 group-hover:scale-110`} />
                        <PlayBadge />
                      </>
                    )}
                  </span>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </LockPanel>

      <AnimatePresence>{movie && <Movie items={items} song={songRef.current} onClose={closeMovie} />}</AnimatePresence>

      <Modal open={open !== null} onClose={() => setOpen(null)} label="Memory" wide>
        {cur && open !== null && (
          <div className="flex flex-col items-center">
            <div className="relative overflow-hidden rounded-[1.2rem] bg-black/5" style={{ width: "min(100%, calc(62vh * 1.7778))", aspectRatio: "16 / 9" }}>
              {cur.type === "image" ? (
                <Image src={cur.src} alt="A memory of us" fill sizes="(max-width:900px) 90vw, 800px" priority className="object-cover" />
              ) : (
                <video key={cur.src} src={cur.src} controls autoPlay playsInline onPlay={lightDuck.duck} className={`h-full w-full bg-black ${fit(cur)}`} />
              )}
            </div>
            <p className="mt-3 text-sm font-bold text-deep/70">{open + 1} / {items.length}</p>
            <div className="mt-3 flex justify-center gap-3">
              <button type="button" className="btn-soft" onClick={() => setOpen((open + items.length - 1) % items.length)}>← Previous</button>
              <button type="button" className="btn-glow !min-h-12 !px-6 !text-base" onClick={() => setOpen((open + 1) % items.length)}>Next →</button>
            </div>
          </div>
        )}
      </Modal>
    </Section>
  );
}
