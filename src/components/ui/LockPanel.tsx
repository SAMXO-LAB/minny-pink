"use client";
import { FormEvent, ReactNode, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  /** Required password. Empty string = no lock at all. */
  password: string;
  message: string;
  children: ReactNode;
  /** Called once when the right password is entered. */
  onUnlock?: () => void;
};

export function LockIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M7 10V8a5 5 0 0110 0v2h1a1 1 0 011 1v9a1 1 0 01-1 1H6a1 1 0 01-1-1v-9a1 1 0 011-1zm2 0h6V8a3 3 0 00-6 0z" />
    </svg>
  );
}

/** Password gate. The check happens in the browser — it keeps casual visitors out, nothing more. */
export default function LockPanel({ password, message, children, onUnlock }: Props) {
  const [open, setOpen] = useState(!password);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [tries, setTries] = useState(0);
  const id = useId();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (value === password) {
      setError("");
      setOpen(true);
      onUnlock?.();
    } else {
      setError("That's not it — try again.");
      setValue("");
      setTries((t) => t + 1);
    }
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {open ? (
        <motion.div key="open" initial={{ opacity: 0, y: 20, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.6 }}>
          {children}
        </motion.div>
      ) : (
        <motion.form
          key="lock"
          onSubmit={submit}
          exit={{ opacity: 0, scale: 0.94, filter: "blur(8px)" }}
          transition={{ duration: 0.3 }}
          className="glass glow-ring mx-auto flex w-full max-w-md flex-col items-center gap-4 rounded-[2rem] px-6 py-9 text-center sm:px-9"
        >
          <span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-rose to-hot text-white shadow-glow">
            <LockIcon className="h-8 w-8" />
          </span>
          <p className="text-balance text-lg font-semibold text-deep">{message}</p>
          <motion.div key={tries} animate={tries ? { x: [0, -10, 10, -7, 7, 0] } : undefined} transition={{ duration: 0.4 }} className="flex w-full flex-col gap-3 sm:flex-row">
            <label htmlFor={id} className="sr-only">Password</label>
            <input
              id={id}
              type="password"
              inputMode="numeric"
              autoComplete="off"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Password"
              className="min-h-12 w-full rounded-full border border-white/80 bg-white/80 px-5 text-center text-lg font-semibold tracking-widest text-deep outline-none placeholder:tracking-normal placeholder:text-deep/40 focus:border-hot focus:ring-4 focus:ring-hot/20"
            />
            <button type="submit" className="btn-glow !min-h-12 !px-7 !text-base">Unlock</button>
          </motion.div>
          <p role="status" className="min-h-[1.25rem] text-sm font-semibold text-hot">{error}</p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
