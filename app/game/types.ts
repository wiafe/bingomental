export interface Board {
  id: string;
  name: string;
  size: number;
  pool: number;
  universe: number;
  ms: number;
  mult: number;
  color: string;
  sub: string;
}

export interface Ability {
  id: string;
  name: string;
  icon: string;
  color: string;
  desc: string;
}

export interface TLNodeData {
  id: string;
  label: string;
  icon: string;
  sub: string;
  color: string;
  cost: number;
  _owned?: boolean;
}

export interface TLRow {
  lv: number;
  lft: TLNodeData | null;
  ctr: TLNodeData | null;
  rgt: TLNodeData | null;
}

export interface UnlockableNode extends TLNodeData {
  unlockLv: number;
}

export interface Pattern {
  id: string;
  name: string;
  type: string;
  cells: number[];
}

export interface DerivedStats {
  slots: number;
  rerolls: number;
  poolBonus: number;
  speedMult: number;
  haulMult: number;
}

export interface XpProgress {
  cur: number;
  need: number;
  pct: number;
}

export interface RunResult {
  coins: number;
  xpGain: number;
  rawFrags: number;
  isNew: boolean;
  lvUp: boolean;
  newLv: number | null;
  boardId: string;
  boardName: string;
  pats: string[];
}

export interface EventLogEntry {
  id: number;
  text: string;
  coins: number;
}

export interface RunState {
  card: (number | null)[];
  pool: number[];
  pats: Pattern[];
  b: Board;
  placed: Record<number, string>;
  daubed: Set<number>;
  done: Set<string>;
  coins: number;
  evs: EventLogEntry[];
  wild: boolean;
  ep: number;
}

export interface Celebration {
  patName: string;
  patType: string;
  coins: number;
  id: number;
}

export type Phase = "meta" | "prep" | "run" | "result";
