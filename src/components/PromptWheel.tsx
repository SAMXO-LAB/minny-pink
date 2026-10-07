"use client";
import { useMemo, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue } from "framer-motion";
import { IconHeart, Rich } from "./Icons";
import { PromptSlice } from "@/lib/content";
import { useAvatar } from "./AvatarProvider";
import { useFx } from "./FxLayer";
import { chime } from "@/lib/music";

const R = 200;
const PINK = { fills: ["#ffe0ec", "#ffa9cb", "#fff0f6", "#ff86b6", "#ffd0e3", "#ff6aa8"], text: ["#8a1f55", "#fff", "#8a1f55", "#fff", "#8a1f55", "#fff"] };
const LAVENDER = { fills: ["#f1e4ff", "#c9a8ff", "#fbf5ff", "#b48cf5", "#e6d3ff", "#a07af0"], text: ["#5b2a9a", "#fff", "#5b2a9a", "#fff", "#5b2a9a", "#fff"] };
export const WHEEL_THEMES = { pink: PINK, lavender: LAVENDER };

function polar(deg: number, r: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return [R + r * Math.cos(a), R + r * Math.sin(a)];
}

type Props = {
  items: PromptSlice[];
  ariaLabel: string;
  theme?: keyof typeof WHEEL_THEMES;
  idleHint?: string;
};

/** A spin-the-wheel where every slice has a short label and a longer prompt. */
export default function PromptWheel({ items, ariaLabel, theme = "pink", idleHint = "Tap SPIN and see what the stars decide." }: Props) {
  const N = items.length;
  const SEG = 360 / N;
  const { fills, text } = WHEEL_THEMES[theme];
  const uid = useMemo(() => `pw${Math.random().toString(36).slice(2, 7)}`, []);
  const rot = useMotionValue(0);
  const pointer = useMotionValue(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<PromptSlice | null>(null);
  const { react } = useAvatar();
  const fx = useFx();
  const lastSeg = useRef(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  const bulbs = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);

  const slice = (i: number, r: number) => {
    const [x1, y1] = polar(i * SEG, r);
    const [x2, y2] = polar((i + 1) * SEG, r);
    return `M${R} ${R}L${x1} ${y1}A${r} ${r} 0 0 1 ${x2} ${y2}Z`;
  };

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    react("excited", 5600, "Spin, spin, spin!");
    const idx = Math.floor(Math.random() * N);
    const centre = idx * SEG + SEG / 2;
    const jitter = (Math.random() - 0.5) * (SEG * 0.6);
    const cur = rot.get();
    const delta = ((-(centre + jitter) - cur) % 360 + 360) % 360;
    const target = cur + 360 * 5 + delta;
    lastSeg.current = Math.floor((((-cur % 360) + 360) % 360) / SEG);
    animate(rot, target, {
      duration: 5.4,
      ease: [0.12, 0.72, 0.14, 1],
      onUpdate: (v) => {
        const seg = Math.floor((((-v % 360) + 360) % 360) / SEG);
        if (seg !== lastSeg.current) {
          lastSeg.current = seg;
          animate(pointer, [0, -22, 0], { duration: 0.18 });
        }
      },
      onComplete: () => {
        setSpinning(false);
        setResult(items[idx]);
        react("love", 3800, "Ooh, that one 💗");
        chime("up");
        const box = wheelRef.current?.getBoundingClientRect();
        const cx = box ? box.left + box.width / 2 : window.innerWidth / 2;
        const cy = box ? box.top + box.height / 2 : window.innerHeight / 2;
        fx.hearts(cx, cy, 22);
      },
    });
  };

  const fontSize = N > 12 ? 12 : 14;
  const x0 = 58; // start clear of the hub
  const avail = 164 - x0; // end just inside the rim

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center">
      <div ref={wheelRef} className="relative w-[min(88vw,430px)]">
        <div aria-hidden="true" className="absolute inset-[-6%] rounded-full bg-hot/30 blur-3xl" />
        <div className="absolute left-1/2 top-[-3.5%] z-20 w-[12%] -translate-x-1/2 drop-shadow-lg" aria-hidden="true">
          <motion.div style={{ rotate: pointer, originX: 0.5, originY: 0.2 }}>
            <svg viewBox="0 0 48 60" className="h-auto w-full">
              <defs>
                <linearGradient id={`${uid}ptr`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#ff5c9d" />
                  <stop offset="1" stopColor="#c01a64" />
                </linearGradient>
              </defs>
              <path d="M24 58L6 28C-2 14 8 2 24 2s26 12 18 26z" fill={`url(#${uid}ptr)`} stroke="#fff" strokeWidth="3" strokeLinejoin="round" />
              <circle cx="24" cy="20" r="6" fill="#fff" opacity=".9" />
            </svg>
          </motion.div>
        </div>

        <motion.div style={{ rotate: rot }} className="relative aspect-square w-full will-change-transform">
          <svg viewBox="0 0 400 400" className="h-full w-full overflow-visible" role="img" aria-label={ariaLabel}>
            <defs>
              <radialGradient id={`${uid}rim`} cx=".5" cy=".5" r=".5">
                <stop offset=".9" stopColor="#ff4d94" />
                <stop offset="1" stopColor="#c01a64" />
              </radialGradient>
              <filter id={`${uid}sh`} x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#b3246a" floodOpacity=".35" />
              </filter>
            </defs>
            <circle cx={R} cy={R} r="198" fill={`url(#${uid}rim)`} filter={`url(#${uid}sh)`} />
            <circle cx={R} cy={R} r="190" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="2" />
            {items.map((w, i) => (
              <g key={w.label}>
                <path d={slice(i, 172)} fill={fills[i % fills.length]} stroke="#fff" strokeWidth="3" />
                <g transform={`rotate(${i * SEG + SEG / 2 - 90} ${R} ${R})`}>
                  <text
                    x={R + x0}
                    y={R + fontSize * 0.35}
                    fontSize={fontSize}
                    fontWeight="800"
                    fill={text[i % text.length]}
                    textLength={w.label.length * fontSize * 0.6 > avail ? avail : undefined}
                    lengthAdjust="spacingAndGlyphs"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {w.label}
                  </text>
                </g>
              </g>
            ))}
            {bulbs.map((b) => {
              const [x, y] = polar((b * 360) / bulbs.length, 185);
              return <circle key={b} cx={x} cy={y} r="3.6" fill="#fff" style={{ animation: "bulb 1.4s ease-in-out infinite", animationDelay: `${(b % 2) * 0.7}s`, filter: "drop-shadow(0 0 4px #fff)" }} />;
            })}
            <circle cx={R} cy={R} r="44" fill="#fff" stroke="#ff8fb8" strokeWidth="5" />
          </svg>
        </motion.div>

        <button
          type="button"
          onClick={spin}
          disabled={spinning}
          aria-label="Spin the wheel"
          className="absolute left-1/2 top-1/2 z-10 grid h-[24%] w-[24%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-br from-rose to-hot text-white shadow-glow transition-transform hover:scale-105 active:scale-95 disabled:opacity-90"
          style={{ boxShadow: "0 0 0 5px #fff, 0 10px 30px rgba(255,61,139,.55)" }}
        >
          <span className="text-center text-[0.9rem] font-extrabold leading-none tracking-wide sm:text-lg">
            {spinning ? <IconHeart className="mx-auto h-6 w-6 animate-pulse" /> : "SPIN"}
          </span>
        </button>
      </div>

      <div className="mt-8 min-h-[11rem] w-full">
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              key={result.label}
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 180, damping: 16 }}
              className="glass glow-ring rounded-[1.8rem] px-6 py-6 text-center sm:px-8"
            >
              <p className="text-2xl text-hot" style={{ fontFamily: "var(--font-script)", fontWeight: 700 }}>
                <Rich>{result.label}</Rich>
              </p>
              <p aria-live="polite" className="mx-auto mt-2 max-w-md text-balance text-lg italic leading-relaxed text-deep sm:text-xl" style={{ fontFamily: "var(--font-display)" }}>
                {result.prompt}
              </p>
              <button type="button" className="btn-soft mt-4" onClick={spin}>
                Spin again
              </button>
            </motion.div>
          ) : (
            <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-8 text-center text-lg font-semibold" style={{ color: "var(--fg-soft)" }}>
              {spinning ? "Round and round…" : idleHint}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
