"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const SRC = "/audio/stargirl-interlude.mp3";
const MAX_VOL = 0.85;

/**
 * The very first screen: her birthday cake, with the song playing while she looks at it.
 * Browsers only allow sound after a tap, so we try to autoplay and, if blocked, ask for one tap.
 */
export default function CakeIntro({ onContinue }: { onContinue: () => void }) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const fade = useRef<ReturnType<typeof setInterval> | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false); // "Continue" is allowed

  const ramp = useCallback((to: number, done?: () => void) => {
    const a = audio.current;
    if (!a) return;
    if (fade.current) clearInterval(fade.current);
    fade.current = setInterval(() => {
      const step = to > a.volume ? 0.04 : -0.06;
      a.volume = Math.min(1, Math.max(0, a.volume + step));
      if (Math.abs(a.volume - to) < 0.05) {
        a.volume = to;
        if (fade.current) clearInterval(fade.current);
        done?.();
      }
    }, 60);
  }, []);

  const play = useCallback(async () => {
    const a = audio.current;
    if (!a) return false;
    try {
      a.volume = 0;
      await a.play();
      setPlaying(true);
      ramp(MAX_VOL);
      return true;
    } catch {
      return false;
    }
  }, [ramp]);

  useEffect(() => {
    const a = new Audio(SRC);
    a.loop = true;
    a.preload = "auto";
    audio.current = a;
    play(); // works when the browser allows autoplay; otherwise the button below asks for a tap
    return () => {
      if (fade.current) clearInterval(fade.current);
      a.pause();
      audio.current = null;
    };
  }, [play]);

  // let her see the picture for a moment before "Continue" appears
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 3200);
    return () => clearTimeout(t);
  }, []);

  const leave = () => {
    if (playing) ramp(0, () => audio.current?.pause());
    onContinue();
  };

  return (
    <motion.div
      className="fixed inset-0 z-[120] overflow-hidden bg-[#1a0d10]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, filter: "blur(10px)" }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
    >
      {/* soft, pre-blurred backdrop so wide screens aren't empty */}
      <div aria-hidden="true" className="absolute inset-0 scale-110" style={{ background: "url(/photos/cake-intro-bg.jpg) center/cover" }} />

      <motion.div
        className="absolute inset-0 mx-auto h-full w-full max-w-[100vw]"
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <Image src="/photos/cake-intro.jpg" alt="Your birthday cake" fill priority sizes="(max-width: 600px) 100vw, 60vh" className="object-contain" />
        {/* gentle vignette so the buttons read clearly */}
        <div aria-hidden="true" className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(20,8,12,.35) 0%, transparent 22%, transparent 62%, rgba(20,8,12,.72) 100%)" }} />
      </motion.div>

      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-3 px-6 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-10 text-center">
        {!playing ? (
          <motion.button
            type="button"
            onClick={async () => {
              await play();
              setReady(true);
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, type: "spring", stiffness: 160, damping: 16 }}
            className="btn-glow !px-8 text-lg"
            style={{ animation: "pulse-glow 2.4s ease-in-out infinite" }}
          >
            🎵 Tap to play
          </motion.button>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ duration: 0.8 }} style={{ pointerEvents: ready ? "auto" : "none" }}>
            <button type="button" onClick={leave} className="btn-glow !px-9 text-lg">
              Continue →
            </button>
          </motion.div>
        )}
        {!playing && ready && (
          <button type="button" onClick={leave} className="text-sm font-semibold text-white/80 underline-offset-4 hover:underline">
            continue without sound
          </button>
        )}
      </div>
    </motion.div>
  );
}
