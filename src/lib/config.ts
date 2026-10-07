/**
 * ─────────────────────────────────────────────────────────────
 *  MINNY'S BIRTHDAY WORLD — easy settings
 *  Everything personal lives in this file and in content.ts.
 * ─────────────────────────────────────────────────────────────
 */
export const SITE = {
  /** Her name — used everywhere. */
  name: "Minny",

  /**
   * Her birthday (month 1–12, day 1–31).
   * The countdown always aims at the NEXT occurrence of this date.
     */
  birthday: { month: 10, day: 13 },

  /**
   * Your name, shown under the secret letter ("— Yours, ...").
   * Leave empty "" to keep the letter unsigned.
   */
  fromName: "",

  /**
   * Optional: use your own song instead of the built-in dreamy music.
   * 1. Put an mp3 in /public/audio (e.g. /public/audio/our-song.mp3)
   * 2. Set musicSrc to "/audio/our-song.mp3"
   * Leave "" to use the generated, royalty-free dreamy melody.
   */
  musicSrc: "/audio/perfect.mp3",

  /** Second countdown, shown under the birthday one. Set to null to hide it. */
  anniversary: { year: 2026, month: 11, day: 6, title: "Our First Anniversary 💍", done: "Happy anniversary, my love 💕" } as {
    year: number; month: number; day: number; title: string; done: string;
  } | null,

  /**
   * Passwords for the "private" corners. NOTE: these two are checked in the
   * browser, so they keep casual visitors out but are not real security.
   * (The guestbook-reading password is checked on the server — see
   * src/app/api/letters/route.ts.) Set to "" to remove a lock.
   */
  memoryPassword: "13102005",
  romancePassword: "06111213",
};

/**
 * Handy testing links (no code changes needed):
 *   /?preview=birthday  → jump straight to the "It's Minny's Birthday!" celebration
 *   /?date=2026-10-08   → pretend her birthday is on that date (counts down to it)
 */
