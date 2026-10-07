"use client";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TRUTHS, DARES } from "@/lib/content";
import { useAvatar } from "./AvatarProvider";
import { useFx } from "./FxLayer";

function pickNew(list: string[], last: string | null) {
  const pool = list.filter((x) => x !== last);
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function TruthOrDare() {
  const [card, setCard] = useState<{ kind: "truth" | "dare"; text: string } | null>(null);
  const last = useRef<string | null>(null);
  const { react } = useAvatar();
  const fx = useFx();

  const draw = (kind: "truth" | "dare") => {
    const text = pickNew(kind === "truth" ? TRUTHS : DARES, last.current);
    last.current = text;
    setCard({ kind, text });
    if (kind === "truth") react("shy", 2600, "Ooh… a truth 🙈");
    else react("excited", 2600, "Dare accepted!");
    fx.hearts(window.innerWidth / 2, window.innerHeight * 0.55, 12);
  };

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-7">
      <div className="glass glow-ring flex min-h-[13rem] w-full items-center justify-center rounded-[2rem] px-6 py-8 text-center sm:px-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={card ? card.text : "idle"}
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {card ? (
              <>
                <p className="text-2xl text-hot" style={{ fontFamily: "var(--font-script)", fontWeight: 700 }}>
                  {card.kind === "truth" ? "Truth" : "Dare"}
                </p>
                <p aria-live="polite" className="mt-2 text-balance text-xl italic leading-relaxed text-deep sm:text-2xl" style={{ fontFamily: "var(--font-display)" }}>
                  {card.text}
                </p>
              </>
            ) : (
              <p className="text-balance text-lg font-semibold sm:text-xl" style={{ color: "var(--fg-soft)" }}>
                Pick truth or dare, and let&rsquo;s find out something sweet.
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <button type="button" className="btn-glow !px-9" onClick={() => draw("truth")}>Truth</button>
        <button type="button" className="btn-soft !min-h-12 !px-9 !text-base" onClick={() => draw("dare")}>Dare</button>
      </div>
    </div>
  );
}
