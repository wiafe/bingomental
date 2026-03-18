import { XP_THRESH, PAT_BASE } from "./constants";
import type { DerivedStats, XpProgress, Pattern } from "./types";

export function levelOf(xp: number): number {
  for (let i = XP_THRESH.length - 1; i >= 0; i--) {
    if (xp >= XP_THRESH[i]) return Math.min(i + 1, 10);
  }
  return 1;
}

export function xpProg(xp: number): XpProgress {
  const lv = levelOf(xp);
  if (lv >= 10) return { cur: 0, need: 0, pct: 1 };
  const base = XP_THRESH[lv - 1];
  const need = XP_THRESH[lv] - base;
  const cur = xp - base;
  return { cur, need, pct: Math.min(1, cur / need) };
}

export function deriveStats(unlocked: Set<string>): DerivedStats {
  const h = (id: string) => unlocked.has(id);
  return {
    slots: 1 + [h("slot2"), h("slot3"), h("slot4"), h("slot5")].filter(Boolean).length,
    rerolls: h("reroll") ? 1 : 0,
    poolBonus: (h("pool1") ? 4 : 0) + (h("pool2") ? 4 : 0),
    speedMult: h("speed1") ? 0.85 : 1.0,
    haulMult: h("haul1") ? 1.3 : 1.0,
  };
}

export function buildCard(size: number, universe: number): number[] {
  const n = size * size;
  const src = Array.from({ length: universe }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
  return src.slice(0, n);
}

export function buildPool(pool: number, universe: number): number[] {
  return Array.from({ length: universe }, (_, i) => i + 1)
    .sort(() => Math.random() - 0.5)
    .slice(0, pool);
}

export function buildPats(size: number): Pattern[] {
  const ps: Pattern[] = [];

  for (let r = 0; r < size; r++) {
    ps.push({ id: `r${r}`, name: `Row ${r + 1}`, type: "line", cells: Array.from({ length: size }, (_, c) => r * size + c) });
  }
  for (let c = 0; c < size; c++) {
    ps.push({ id: `c${c}`, name: `Col ${c + 1}`, type: "line", cells: Array.from({ length: size }, (_, r) => r * size + c) });
  }
  ps.push({ id: "d1", name: "Diag ↘", type: "diag", cells: Array.from({ length: size }, (_, i) => i * size + i) });
  ps.push({ id: "d2", name: "Diag ↗", type: "diag", cells: Array.from({ length: size }, (_, i) => i * size + (size - 1 - i)) });
  ps.push({ id: "corners", name: "Corners", type: "corners", cells: [0, size - 1, (size - 1) * size, size * size - 1] });

  const all = Array.from({ length: size * size }, (_, i) => i);
  ps.push({ id: "blackout", name: "BLACKOUT", type: "blackout", cells: all });

  return ps;
}

export function calcCoins(pat: Pattern, mult: number, goldSet: Set<number>, daubed: Set<number>): number {
  const base = Math.round((PAT_BASE[pat.type] || 5) * mult);
  return base + pat.cells.filter(c => goldSet.has(c) && daubed.has(c)).length * base;
}

export function getCellWidth(size: number): number {
  const vw = typeof window !== "undefined" ? window.innerWidth : 400;
  if (size === 5) return vw < 480 ? Math.floor((vw - 80) / 5) : vw < 600 ? 70 : 80;
  if (size === 4) return vw < 480 ? Math.floor((vw - 72) / 4) : vw < 600 ? 88 : 100;
  return vw < 480 ? Math.floor((vw - 60) / 3) : vw < 600 ? 110 : 124;
}
