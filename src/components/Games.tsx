"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Section from "./ui/Section";
import MinnyAvatar from "./MinnyAvatar";
import HeartGame from "./HeartGame";
import MemoryGame from "./MemoryGame";
import SpinWheel from "./SpinWheel";
import PromptWheel from "./PromptWheel";
import TruthOrDare from "./TruthOrDare";
import LockPanel from "./ui/LockPanel";
import { LOVE_WHEEL, ROMANCE_WHEEL } from "@/lib/content";
import { SITE } from "@/lib/config";
import { Rich } from "./Icons";

const TABS = [
  { id: "hearts", label: "Catch Hearts", blurb: "Tap the falling hearts — the more you catch, the happier she gets." },
  { id: "match", label: "Heart Match", blurb: "Flip the cards and find every matching pair." },
  { id: "wheel", label: "Birthday Wheel", blurb: "One spin, one little surprise. Let the stars decide." },
  { id: "tod", label: "Truth or Dare", blurb: "Pick one, answer honestly, and find out something sweet." },
  { id: "love", label: "Love Wheel", blurb: "Twelve little prompts, all about us." },
  { id: "romance", label: "Romance 🔒", blurb: "This one's just for the two of us." },
] as const;

export default function Games() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("hearts");
  const cur = TABS.find((t) => t.id === tab)!;

  return (
    <Section id="games" eyebrow="just for fun" title={`Play With ${SITE.name}`} subtitle="Tiny games, all wrapped in love. No losing — only cuteness.">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-end sm:justify-center sm:gap-8">
          <MinnyAvatar className="w-[7.5rem] shrink-0 sm:w-[10rem]" />
          <div className="w-full max-w-lg text-center sm:pb-6 sm:text-left">
            <div role="tablist" aria-label="Games" className="glass relative grid w-full grid-cols-3 gap-1 rounded-[1.7rem] p-1.5">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  type="button"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={`relative z-10 min-h-10 rounded-full px-2 text-[0.8rem] font-bold transition-colors sm:text-sm ${tab === t.id ? "text-white" : "text-deep/80 hover:text-deep"}`}
                >
                  {tab === t.id && (
                    <motion.span layoutId="game-tab" className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-rose to-hot shadow-glow" transition={{ type: "spring", stiffness: 350, damping: 30 }} />
                  )}
                  <Rich iconClass={tab === t.id ? "text-white" : "text-hot"}>{t.label}</Rich>
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm font-medium sm:text-base" style={{ color: "var(--fg-soft)" }}>
              {cur.blurb}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              role="tabpanel"
              initial={{ opacity: 0, y: 30, filter: "blur(10px)", scale: 0.98 }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
              exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
              transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {tab === "hearts" && <HeartGame />}
              {tab === "match" && <MemoryGame />}
              {tab === "wheel" && <SpinWheel />}
              {tab === "tod" && <TruthOrDare />}
              {tab === "love" && <PromptWheel items={LOVE_WHEEL} ariaLabel="Love wheel with twelve little prompts" />}
              {tab === "romance" && (
                <LockPanel password={SITE.romancePassword} message="This one's just for us. Enter the password to spin.">
                  <PromptWheel items={ROMANCE_WHEEL} theme="lavender" ariaLabel="Romance wheel with fifteen prompts" idleHint="Spin for a little romantic moment." />
                </LockPanel>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}
