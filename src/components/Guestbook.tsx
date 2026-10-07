"use client";
import { FormEvent, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Section from "./ui/Section";
import Modal from "./ui/Modal";
import { LockIcon } from "./ui/LockPanel";
import { Rich } from "./Icons";
import { SITE } from "@/lib/config";
import { useAvatar } from "./AvatarProvider";
import { useFx } from "./FxLayer";

type Letter = { author: string; message: string; date: string };

const PAPER = {
  background: "repeating-linear-gradient(to bottom, transparent 0, transparent 31px, rgba(255,120,170,.28) 31px, rgba(255,120,170,.28) 32px), linear-gradient(180deg,#fffdf9,#fff6f1)",
  backgroundPositionY: "12px",
} as const;

function fmt(iso: string) {
  try {
    const d = new Date(iso);
    return `${d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })} · ${d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}`;
  } catch {
    return "";
  }
}

/* ───────── write ───────── */
function WriteLetter() {
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const { react } = useAvatar();
  const fx = useFx();
  const msgId = useId();
  const nameId = useId();

  const send = async (e: FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !message.trim()) {
      setStatus({ ok: false, text: "Please add your name and a message first." });
      return;
    }
    setBusy(true);
    setStatus({ ok: true, text: "Sending…" });
    try {
      const res = await fetch("/api/letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author: author.trim(), message: message.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setStatus({ ok: true, text: "Sent 💌 — thank you for the letter!" });
        setAuthor("");
        setMessage("");
        react("shy", 3200, "Aww, a letter for me?!");
        fx.heartRain(22);
      } else {
        setStatus({ ok: false, text: data.error || "Something went wrong. Please try again." });
      }
    } catch {
      setStatus({ ok: false, text: "Could not send right now. Please try again in a moment." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={send} className="mx-auto w-full max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 40, rotate: -2 }}
        whileInView={{ opacity: 1, y: 0, rotate: -0.8 }}
        viewport={{ once: true, margin: "-8%" }}
        transition={{ type: "spring", stiffness: 90, damping: 16 }}
        className="relative rounded-[1.4rem] px-6 pb-7 pt-9 shadow-[0_30px_70px_-30px_rgba(179,36,106,.55)] ring-1 ring-white/70 sm:px-10"
        style={PAPER}
      >
        <span aria-hidden="true" className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-gradient-to-br from-rose to-hot shadow-md ring-2 ring-white" />
        <p className="text-4xl text-hot" style={{ fontFamily: "var(--font-script)", fontWeight: 700 }}>
          Dear {SITE.name},
        </p>
        <label htmlFor={msgId} className="sr-only">Your letter</label>
        <textarea
          id={msgId}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={5000}
          rows={7}
          placeholder="Write whatever you'd like her to know… take as many lines as you need."
          className="mt-3 block w-full resize-y bg-transparent text-lg text-deep outline-none placeholder:text-deep/40"
          style={{ lineHeight: "32px", fontFamily: "var(--font-body)", fontWeight: 500 }}
        />
        <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
          <span className="text-xl text-deep/70" style={{ fontFamily: "var(--font-script)" }}>With love,</span>
          <label htmlFor={nameId} className="sr-only">Your name</label>
          <input
            id={nameId}
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            maxLength={60}
            placeholder="your name"
            className="w-44 border-0 border-b-2 border-hot/40 bg-transparent px-1 text-center text-2xl text-hot outline-none placeholder:text-hot/40 focus:border-hot"
            style={{ fontFamily: "var(--font-script)", fontWeight: 700 }}
          />
        </div>
      </motion.div>
      <div className="mt-7 flex flex-col items-center gap-3">
        <button type="submit" disabled={busy} className="btn-glow !px-9 !text-lg disabled:opacity-70">
          <Rich iconClass="text-white">Send Letter 💌</Rich>
        </button>
        <p role="status" aria-live="polite" className={`min-h-[1.5rem] text-center text-sm font-semibold ${status && !status.ok ? "text-hot" : "text-deep/80"}`}>
          {status ? <Rich>{status.text}</Rich> : ""}
        </p>
      </div>
    </form>
  );
}

/* ───────── read ───────── */
function Envelope({ letter, index, onOpen }: { letter: Letter; index: number; onOpen: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      aria-label={`Open the letter from ${letter.author}`}
      initial={{ opacity: 0, y: 30, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 140, damping: 16, delay: Math.min(index, 10) * 0.07 }}
      whileHover="hover"
      whileTap={{ scale: 0.97 }}
      className="group relative block h-[11.5rem] w-full text-left"
    >
      <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#ffe3ee] to-[#ffc2d9] shadow-[0_18px_40px_-18px_rgba(179,36,106,.6)] ring-1 ring-white/80" />
      {/* the little letter peeking out */}
      <motion.span variants={{ hover: { y: -16 } }} transition={{ type: "spring", stiffness: 240, damping: 18 }} className="absolute inset-x-5 top-4 h-24 rounded-lg bg-white shadow" style={PAPER} />
      {/* front pocket */}
      <span className="absolute inset-x-0 bottom-0 h-[62%] rounded-b-2xl bg-gradient-to-br from-[#ffd0e3] to-[#ffb3d1]" style={{ clipPath: "polygon(0 0, 50% 46%, 100% 0, 100% 100%, 0 100%)" }} />
      <span className="absolute inset-x-0 top-0 h-1/2 origin-top rounded-t-2xl bg-gradient-to-b from-[#ffb3d1] to-[#ffc9de] transition-opacity duration-300 [clip-path:polygon(0_0,100%_0,50%_100%)] group-hover:opacity-0" aria-hidden="true" />
      <span className="absolute left-1/2 top-[44%] grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-br from-rose to-hot text-white shadow-md ring-2 ring-white">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.3 3 4.5 6.7 4.5c2.1 0 3.600 1.100 5.300 3.100 1.700-2 3.200-3.100 5.300-3.100 3.700 0 5.800 3.800 4.300 7.200C19.500 16.400 12 21 12 21z" /></svg>
      </span>
      <span className="absolute inset-x-3 bottom-3 text-center">
        <span className="block text-[0.65rem] font-bold uppercase tracking-[0.25em] text-deep/60">a letter from</span>
        <span className="block truncate text-2xl leading-tight text-deep" style={{ fontFamily: "var(--font-script)", fontWeight: 700 }}>{letter.author}</span>
        <span className="block truncate text-[0.7rem] font-semibold text-deep/60">{fmt(letter.date)}</span>
      </span>
    </motion.button>
  );
}

function ReadLetters() {
  const [password, setPassword] = useState("");
  const [letters, setLetters] = useState<Letter[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [tries, setTries] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const id = useId();

  const load = async (pwd: string) => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/letters?password=${encodeURIComponent(pwd)}`, { cache: "no-store" });
      if (res.status === 401) {
        setError("That's not it — try again.");
        setPassword("");
        setTries((t) => t + 1);
        return false;
      }
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setLetters(data.letters || []);
        return true;
      }
      setError(data.error || "Could not load letters right now.");
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
    return false;
  };

  const unlock = async (e: FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Please enter the password.");
      return;
    }
    await load(password);
  };

  const cur = open !== null && letters ? letters[open] : null;

  return (
    <div className="glass glow-ring mx-auto w-full max-w-4xl rounded-[2rem] px-5 py-8 sm:px-9">
      <AnimatePresence mode="wait" initial={false}>
        {letters === null ? (
          <motion.form key="lock" onSubmit={unlock} exit={{ opacity: 0, scale: 0.95 }} className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-rose to-hot text-white shadow-glow">
              <LockIcon className="h-8 w-8" />
            </span>
            <p className="text-balance text-lg font-semibold text-deep">Enter the password to read what everyone wrote.</p>
            <motion.div key={tries} animate={tries ? { x: [0, -10, 10, -7, 7, 0] } : undefined} transition={{ duration: 0.4 }} className="flex w-full flex-col gap-3 sm:flex-row">
              <label htmlFor={id} className="sr-only">Password</label>
              <input
                id={id}
                type="password"
                inputMode="numeric"
                autoComplete="off"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="min-h-12 w-full rounded-full border border-white/80 bg-white/80 px-5 text-center text-lg font-semibold tracking-widest text-deep outline-none placeholder:tracking-normal placeholder:text-deep/40 focus:border-hot focus:ring-4 focus:ring-hot/20"
              />
              <button type="submit" disabled={busy} className="btn-glow !min-h-12 !px-7 !text-base disabled:opacity-70">{busy ? "…" : "Unlock"}</button>
            </motion.div>
            <p role="status" className="min-h-[1.25rem] text-sm font-semibold text-hot">{error}</p>
          </motion.form>
        ) : (
          <motion.div key="letters" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-2xl font-bold text-deep"><Rich>💌 What everyone wrote</Rich></h3>
              <button type="button" className="btn-soft !min-h-10 !px-5 !text-sm" disabled={busy} onClick={() => load(password)}>{busy ? "Refreshing…" : "Refresh"}</button>
            </div>
            {letters.length === 0 ? (
              <p className="py-10 text-center text-lg font-semibold" style={{ color: "var(--fg-soft)" }}>No letters yet — check back soon.</p>
            ) : (
              <>
                <p className="mb-5 mt-1 text-sm font-semibold" style={{ color: "var(--fg-soft)" }}>tap an envelope to open it</p>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {letters.map((l, i) => (
                    <Envelope key={`${l.date}-${i}`} letter={l} index={i} onOpen={() => setOpen(i)} />
                  ))}
                </div>
              </>
            )}
            {error && <p role="status" className="mt-4 text-center text-sm font-semibold text-hot">{error}</p>}
          </motion.div>
        )}
      </AnimatePresence>

      <Modal open={open !== null} onClose={() => setOpen(null)} label="Letter">
        {cur && (
          <div className="rounded-[1.2rem] px-5 pb-6 pt-8 ring-1 ring-white/70" style={PAPER}>
            <p className="text-4xl text-hot" style={{ fontFamily: "var(--font-script)", fontWeight: 700 }}>Dear {SITE.name},</p>
            <p className="mt-3 whitespace-pre-wrap break-words text-lg text-deep" style={{ lineHeight: "32px", fontWeight: 500 }}>{cur.message}</p>
            <p className="mt-5 text-right text-3xl text-hot" style={{ fontFamily: "var(--font-script)", fontWeight: 700 }}>— {cur.author}</p>
            <p className="mt-1 text-right text-xs font-semibold text-deep/60">{fmt(cur.date)}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default function Guestbook() {
  return (
    <Section id="letters" eyebrow="from everyone who loves you" title="Letters From Everyone" subtitle="Anyone can leave her a letter here — as many paragraphs as they like.">
      <WriteLetter />
      <div className="mt-20">
        <ReadLetters />
      </div>
    </Section>
  );
}
