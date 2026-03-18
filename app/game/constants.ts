import type { Board, Ability, TLRow, TLNodeData, UnlockableNode } from "./types";

export const BOARDS: Board[] = [
  { id: "quick",    name: "QUICK",    size: 3, pool: 12, universe: 28, ms: 700,  mult: 1.0, color: "#c4c4c4", sub: "3×3 · quick loop" },
  { id: "classic",  name: "CLASSIC",  size: 4, pool: 20, universe: 45, ms: 820,  mult: 1.8, color: "#888888", sub: "4×4 · balanced depth" },
  { id: "blitz",    name: "BLITZ",    size: 3, pool: 9,  universe: 22, ms: 360,  mult: 1.3, color: "#d4d4d4", sub: "3×3 · speed rush" },
  { id: "standard", name: "STANDARD", size: 5, pool: 28, universe: 75, ms: 940,  mult: 2.6, color: "#707070", sub: "5×5 · full bingo" },
  { id: "grand",    name: "GRAND",    size: 5, pool: 38, universe: 99, ms: 680,  mult: 5.0, color: "#f0f0f0", sub: "5×5 · endgame" },
];

export const ABILITIES: Ability[] = [
  { id: "anchor", name: "ANCHOR", icon: "◉", color: "#c0c0c0", desc: "Pre-daubed when run starts" },
  { id: "gold",   name: "GOLD",   icon: "◆", color: "#e8e8e8", desc: "×2 coins on any line complete" },
  { id: "wild",   name: "WILD",   icon: "⟳", color: "#909090", desc: "Auto-daubs when 40% pool called" },
  { id: "bomb",   name: "BOMB",   icon: "⬡", color: "#b0b0b0", desc: "Daubes 4 orthogonal neighbors on hit" },
  { id: "jinx",   name: "JINX",   icon: "◌", color: "#686868", desc: "+60 coins if never daubed at run end" },
];

export const TL: TLRow[] = [
  { lv: 1,  lft: { id: "quick",    label: "QUICK",    icon: "▣", sub: "3×3 starter",         color: "#c4c4c4", cost: 0 },  ctr: null,                                                                                       rgt: { id: "anchor",  label: "ANCHOR",  icon: "◉", sub: "Pre-daub a square",  color: "#c0c0c0", cost: 8 } },
  { lv: 2,  lft: null,                                                                                                       ctr: { id: "slot2",   label: "SLOT 2",   icon: "⊞", sub: "2nd ability slot",   color: "#888888", cost: 8 },  rgt: { id: "gold",   label: "GOLD",    icon: "◆", sub: "×2 coins on lines",  color: "#e8e8e8", cost: 12 } },
  { lv: 3,  lft: { id: "classic",  label: "CLASSIC",  icon: "▣", sub: "4×4 board",            color: "#888888", cost: 12 }, ctr: { id: "reroll",  label: "REROLL",   icon: "↺", sub: "+1 reroll per prep", color: "#c0c0c0", cost: 10 }, rgt: null },
  { lv: 4,  lft: { id: "blitz",    label: "BLITZ",    icon: "▣", sub: "3×3 speed rush",       color: "#d4d4d4", cost: 15 }, ctr: { id: "slot3",   label: "SLOT 3",   icon: "⊞", sub: "3rd ability slot",   color: "#808080", cost: 22 }, rgt: { id: "wild",   label: "WILD",    icon: "⟳", sub: "Auto-daub at 40%",   color: "#909090", cost: 20 } },
  { lv: 5,  lft: null,                                                                                                       ctr: { id: "pool1",   label: "POOL +4",  icon: "⬆", sub: "+4 balls called",    color: "#a0a0a0", cost: 18 }, rgt: null },
  { lv: 6,  lft: { id: "standard", label: "STANDARD", icon: "▣", sub: "5×5 full bingo",       color: "#707070", cost: 25 }, ctr: { id: "speed1",  label: "SPEED +",  icon: "⚡", sub: "Call pace -15%",     color: "#c8c8c8", cost: 28 }, rgt: { id: "bomb",   label: "BOMB",    icon: "⬡", sub: "Splash 4 neighbors", color: "#b0b0b0", cost: 28 } },
  { lv: 7,  lft: null,                                                                                                       ctr: { id: "slot4",   label: "SLOT 4",   icon: "⊞", sub: "4th ability slot",   color: "#787878", cost: 38 }, rgt: null },
  { lv: 8,  lft: null,                                                                                                       ctr: { id: "haul1",   label: "HAUL +",   icon: "◈", sub: "+30% frags/run",     color: "#e0e0e0", cost: 42 }, rgt: { id: "jinx",   label: "JINX",    icon: "◌", sub: "+60 if never daubed", color: "#686868", cost: 38 } },
  { lv: 9,  lft: null,                                                                                                       ctr: { id: "pool2",   label: "POOL +4",  icon: "⬆", sub: "+4 more balls",      color: "#a0a0a0", cost: 44 }, rgt: null },
  { lv: 10, lft: { id: "grand",    label: "GRAND",    icon: "▣", sub: "5×5 endgame",          color: "#f0f0f0", cost: 55 }, ctr: { id: "slot5",   label: "SLOT 5",   icon: "⊞", sub: "5th ability slot",   color: "#767676", cost: 55 }, rgt: null },
];

export const ALL_NODES: UnlockableNode[] = TL.flatMap(r =>
  [r.lft, r.ctr, r.rgt]
    .filter((n): n is TLNodeData => Boolean(n))
    .map(n => ({ ...n, unlockLv: r.lv }))
);

export const XP_THRESH = [0, 50, 110, 200, 310, 450, 620, 820, 1050, 1310, 1600];

export const PAT_BASE: Record<string, number> = { line: 5, diag: 10, corners: 16, blackout: 55 };
