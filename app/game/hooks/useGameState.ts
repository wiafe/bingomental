"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { BOARDS, ALL_NODES, ABILITIES } from "../constants";
import { levelOf, deriveStats, buildCard, buildPool, buildPats, freeCell, calcCoins } from "../helpers";
import type { Phase, RunState, RunResult, EventLogEntry, DerivedStats, Celebration } from "../types";

export default function useGameState() {
  const [xp, setXp] = useState(0);
  const [frags, setFrags] = useState(0);
  const [runs, setRuns] = useState(0);
  const [bestRun, setBestRun] = useState(0);
  const [unlocked, setUnlocked] = useState(new Set(["quick"]));
  const [boardId, setBoardId] = useState("quick");
  const [placed, setPlaced] = useState<Record<number, string>>({});
  const [card, setCard] = useState<(number | null)[] | null>(null);
  const [rerollsLeft, setRerollsLeft] = useState(0);
  const [phase, setPhase] = useState<Phase>("meta");

  // Run state
  const [daubed, setDaubed] = useState(new Set<number>());
  const [called, setCalled] = useState<number[]>([]);
  const [lastNum, setLastNum] = useState<number | null>(null);
  const [donePats, setDonePats] = useState(new Set<string>());
  const [runCoins, setRunCoins] = useState(0);
  const [evLog, setEvLog] = useState<EventLogEntry[]>([]);
  const [flashI, setFlashI] = useState(-1);
  const [bombSet, setBombSet] = useState(new Set<number>());
  const [result, setResult] = useState<RunResult | null>(null);
  const [effectivePool, setEffectivePool] = useState(12);
  const [celebration, setCelebration] = useState<Celebration | null>(null);

  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const RS = useRef<RunState | null>(null);
  const statsRef = useRef<DerivedStats | null>(null);

  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  const board = BOARDS.find(b => b.id === boardId) || BOARDS[0];
  const st = deriveStats(unlocked);

  useEffect(() => { statsRef.current = st; });

  function buyNode(node: { id: string; cost: number }) {
    const nd = ALL_NODES.find(n => n.id === node.id);
    if (!nd) return;
    if (unlocked.has(node.id)) return;
    if (levelOf(xp) < nd.unlockLv) return;
    if (frags < node.cost) return;
    setFrags(f => f - node.cost);
    setUnlocked(s => new Set([...s, node.id]));
    if (BOARDS.find(b => b.id === node.id)) setBoardId(node.id);
  }

  function goPrep() {
    const s = deriveStats(unlocked);
    setPlaced({});
    setRerollsLeft(s.rerolls);
    setCard(buildCard(board.size, board.universe));
    setPhase("prep");
  }

  function pushEv(text: string, coins: number) {
    const ev: EventLogEntry = { id: Date.now() + Math.random(), text, coins };
    RS.current!.evs = [ev, ...RS.current!.evs.slice(0, 5)];
    setEvLog([...RS.current!.evs]);
  }

  function endRun() {
    if (timer.current) clearInterval(timer.current);
    const rs = RS.current;
    if (!rs) return;
    Object.entries(rs.placed).forEach(([i, a]) => {
      if (a === "jinx" && !rs.daubed.has(+i)) {
        rs.coins += 60;
        pushEv("◌ JINX fires", 60);
        setRunCoins(rs.coins);
      }
    });
    const isNew = rs.coins > bestRun;
    const xpGain = 10 + rs.done.size * 8 + (rs.done.has("blackout") ? 30 : 0) + Math.round((rs.b.mult - 1) * 6);
    const s = statsRef.current || deriveStats(unlocked);
    const rawFrags = Math.round((5 + rs.done.size * 3 + (rs.done.has("blackout") ? 15 : 0)) * s.haulMult);
    const prevLv = levelOf(xp);
    const nxp = xp + xpGain;
    const nLv = levelOf(nxp);
    setXp(nxp);
    setFrags(f => f + rawFrags);
    setRuns(r => r + 1);
    if (isNew) setBestRun(rs.coins);
    setResult({
      coins: rs.coins, xpGain, rawFrags, isNew,
      lvUp: nLv > prevLv, newLv: nLv > prevLv ? nLv : null,
      boardId: rs.b.id, boardName: rs.b.name, pats: [...rs.done],
    });
    setPhase("result");
  }

  const tick = useCallback(() => {
    const rs = RS.current;
    if (!rs || rs.pool.length === 0) { endRun(); return; }
    const num = rs.pool.shift()!;
    setLastNum(num);
    setCalled(prev => [num, ...prev]);
    const { card: c, b, daubed: d, pats, placed: pl, ep } = rs;
    const calledSoFar = ep - rs.pool.length;
    if (!rs.wild && calledSoFar >= Math.floor(ep * 0.4)) {
      rs.wild = true;
      Object.entries(pl).forEach(([i, a]) => {
        if (a === "wild" && !d.has(+i)) { d.add(+i); pushEv("⟳ WILD fires", 0); }
      });
    }
    const hitI = c.findIndex(n => n === num);
    if (hitI < 0) { setDaubed(new Set(d)); return; }
    setFlashI(hitI);
    setTimeout(() => setFlashI(-1), 220);
    d.add(hitI);
    if (pl[hitI] === "bomb") {
      const { size } = b;
      const r = Math.floor(hitI / size);
      const col = hitI % size;
      const bombNbrs: number[] = [];
      if (r > 0) bombNbrs.push((r - 1) * size + col);
      if (r < size - 1) bombNbrs.push((r + 1) * size + col);
      if (col > 0) bombNbrs.push(r * size + (col - 1));
      if (col < size - 1) bombNbrs.push(r * size + (col + 1));
      bombNbrs.forEach(n => d.add(n));
      setBombSet(new Set(bombNbrs));
      setTimeout(() => setBombSet(new Set()), 420);
    }
    setDaubed(new Set(d));
    const goldSet = new Set(Object.entries(pl).filter(([, v]) => v === "gold").map(([k]) => +k));
    let bk = false;
    pats.forEach(pat => {
      if (rs.done.has(pat.id) || !pat.cells.every(ci => d.has(ci))) return;
      rs.done.add(pat.id);
      const coins = calcCoins(pat, b.mult, goldSet, d);
      rs.coins += coins;
      setRunCoins(rs.coins);
      pushEv(pat.name, coins);
      setDonePats(new Set(rs.done));
      setCelebration({ patName: pat.name, patType: pat.type, coins, id: Date.now() + Math.random() });
      setTimeout(() => setCelebration(null), 1800);
      if (pat.id === "blackout") bk = true;
    });
    if (bk) {
      if (timer.current) clearInterval(timer.current);
      setTimeout(endRun, 800);
    }
  }, []);

  function startRun() {
    if (timer.current) clearInterval(timer.current);
    const b = board;
    const s = deriveStats(unlocked);
    const ep = b.pool + s.poolBonus;
    const nc = buildCard(b.size, b.universe);
    const pool = buildPool(ep, b.universe);
    const pats = buildPats(b.size);
    const fi = freeCell(b.size);
    const initD = new Set<number>();
    if (fi >= 0) initD.add(fi);
    Object.entries(placed).forEach(([i, a]) => { if (a === "anchor") initD.add(+i); });
    RS.current = { card: nc, pool: [...pool], pats, b, placed: { ...placed }, daubed: new Set(initD), done: new Set(), coins: 0, evs: [], wild: false, ep };
    setCard(nc);
    setDaubed(new Set(initD));
    setCalled([]);
    setLastNum(null);
    setDonePats(new Set());
    setRunCoins(0);
    setEvLog([]);
    setFlashI(-1);
    setBombSet(new Set());
    setCelebration(null);
    setEffectivePool(ep);
    setPhase("run");
    const ms = Math.round(b.ms * s.speedMult);
    timer.current = setInterval(tick, ms);
  }

  function goNextRun() {
    setPlaced({});
    setRerollsLeft(st.rerolls);
    setCard(buildCard(board.size, board.universe));
    setPhase("prep");
  }

  return {
    // Meta state
    xp, frags, runs, bestRun, unlocked, boardId, setBoardId,
    placed, setPlaced, card, setCard, rerollsLeft, setRerollsLeft,
    phase, setPhase, board, st,
    // Run state
    daubed, called, lastNum, donePats, runCoins, evLog, flashI, bombSet,
    result, effectivePool, celebration,
    // Actions
    buyNode, goPrep, startRun, goNextRun,
  };
}
