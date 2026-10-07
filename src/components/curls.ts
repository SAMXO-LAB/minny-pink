/* ──────────────────────────────────────────────────────────────
   Curly-hair geometry for Minny's avatar.
   Everything is computed once, deterministically (no randomness),
   so server and client render the exact same SVG.
   ────────────────────────────────────────────────────────────── */

type P = [number, number];
const f = (n: number) => n.toFixed(1);

/** Shoelace area (screen coords): > 0 means clockwise on screen. */
function area(pts: P[]) {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    a += x1 * y2 - x2 * y1;
  }
  return a;
}

/**
 * Closed outline whose edges are round bumps (one arc per segment),
 * always bulging OUTWARD — this is what makes the hair read as curly.
 */
export function scallop(pts: P[], bump = 0.62): string {
  const sweep = area(pts) > 0 ? 1 : 0;
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 1; i <= pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i % pts.length];
    const r = Math.hypot(x1 - x0, y1 - y0) * bump;
    d += `A${f(r)} ${f(r)} 0 0 ${sweep} ${f(x1)} ${f(y1)}`;
  }
  return d + "z";
}

/** An open spiral (a single ringlet) as a stroke path. */
export function spiral(cx: number, cy: number, r0: number, r1: number, turns = 1.9, start = 0, dir: 1 | -1 = 1): string {
  const steps = Math.max(12, Math.round(turns * 14));
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = start + dir * t * turns * Math.PI * 2;
    const r = r0 + (r1 - r0) * t;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    d += (i === 0 ? "M" : "L") + f(x) + " " + f(y);
  }
  return d;
}

const mirror = (pts: P[]): P[] => pts.map(([x, y]) => [400 - x, y]);

/* ── back hair: a big, bouncy cloud of curls ─────────────────── */
const BACK: P[] = [
  [200, 474], [160, 478], [124, 474], [92, 460], [66, 430], [52, 392], [60, 350], [48, 306], [56, 262],
  [48, 218], [58, 172], [76, 128], [104, 92], [142, 66], [184, 50], [200, 46],
  [232, 50], [262, 62], [298, 84], [324, 116], [342, 156], [352, 200], [344, 244], [352, 290], [344, 334],
  [352, 376], [340, 418], [316, 452], [282, 474], [242, 478],
];
export const BACK_HAIR = scallop(BACK);

/** ringlets drawn on the back hair (dark core + soft pink rim) */
const BACK_SPIRALS: [number, number, number][] = [
  [78, 290, 15], [66, 372, 16], [98, 432, 15], [84, 214, 14], [100, 140, 14],
  [322, 290, 15], [334, 372, 16], [302, 432, 15], [316, 214, 14], [300, 140, 14],
  [128, 456, 12], [272, 456, 12],
];
export const BACK_CURLS = BACK_SPIRALS.map(([x, y, r], i) => spiral(x, y, 2.5, r, 2.1, i * 0.9, i % 2 ? 1 : -1));

/* ── face-framing ringlets (left; right is the mirror) ───────── */
const LOCK_L: P[] = [
  [112, 184], [98, 222], [90, 262], [96, 300], [88, 338], [94, 372], [110, 398], [130, 390],
  [134, 354], [124, 316], [132, 278], [130, 240], [136, 204],
];
export const LOCK_L_PATH = scallop(LOCK_L);
export const LOCK_R_PATH = scallop(mirror(LOCK_L));
export const LOCK_L_CURLS = [
  spiral(112, 376, 2, 13, 1.9, 0.4, 1),
  spiral(108, 300, 2, 10, 1.6, 1.4, -1),
  spiral(112, 238, 2, 9, 1.5, 0.2, 1),
];
export const LOCK_R_CURLS = [
  spiral(288, 376, 2, 13, 1.9, 2.7, -1),
  spiral(292, 300, 2, 10, 1.6, 1.7, 1),
  spiral(288, 238, 2, 9, 1.5, 2.9, -1),
];

/* ── fringe: a curly, side-swept cloud over the forehead ─────── */
const FRINGE: P[] = [
  [104, 208], [94, 170], [104, 130], [128, 94], [162, 68], [200, 56], [238, 68], [272, 94], [296, 130], [306, 170], [296, 208],
  [284, 178], [262, 148], [232, 160], [204, 142], [172, 160], [142, 148], [118, 178],
];
export const FRINGE_PATH = scallop(FRINGE, 0.6);
export const FRINGE_CURLS = [
  spiral(150, 96, 2, 14, 2, 0.5, 1),
  spiral(204, 80, 2, 13, 2, 2.1, -1),
  spiral(258, 104, 2, 13, 2, 1.0, 1),
  spiral(122, 150, 2, 11, 1.7, 3.0, -1),
  spiral(282, 150, 2, 11, 1.7, 0.2, 1),
  spiral(232, 162, 1.5, 8, 1.8, 1.2, 1),
  spiral(172, 162, 1.5, 8, 1.8, 2.6, -1),
];
