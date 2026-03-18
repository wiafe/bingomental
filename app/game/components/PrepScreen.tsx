"use client";

import { useState } from "react";
import { BOARDS, ABILITIES } from "../constants";
import { deriveStats, freeCell, buildCard, getCellWidth } from "../helpers";
import Panel from "./Panel";
import Btn from "./Btn";

interface PrepScreenProps {
  frags: number;
  unlocked: Set<string>;
  boardId: string;
  setBoardId: (id: string) => void;
  placed: Record<number, string>;
  setPlaced: (p: Record<number, string>) => void;
  card: (number | null)[];
  setCard: (c: (number | null)[]) => void;
  rerollsLeft: number;
  setRerollsLeft: React.Dispatch<React.SetStateAction<number>>;
  onLaunch: () => void;
  onBack: () => void;
}

export default function PrepScreen({ frags, unlocked, boardId, setBoardId, placed, setPlaced, card, setCard, rerollsLeft, setRerollsLeft, onLaunch, onBack }: PrepScreenProps) {
  const [heldAb, setHeldAb] = useState<string | null>(null);
  const st = deriveStats(unlocked);
  const board = BOARDS.find(b => b.id === boardId) || BOARDS[0];
  const ownedBs = BOARDS.filter(b => unlocked.has(b.id));
  const ownedAs = ABILITIES.filter(a => unlocked.has(a.id));
  const heldData = heldAb ? ABILITIES.find(a => a.id === heldAb) : null;
  const fi = freeCell(board.size);
  const usedSlots = Object.keys(placed).length;
  const cw = getCellWidth(board.size);

  function clickCell(idx: number) {
    if (idx === fi) return;
    if (!heldAb) {
      if (placed[idx]) {
        const n = { ...placed };
        delete n[idx];
        setPlaced(n);
      }
      return;
    }
    const n = { ...placed };
    if (n[idx] === heldAb) {
      delete n[idx];
    } else {
      if (usedSlots >= st.slots && !n[idx]) return;
      n[idx] = heldAb;
    }
    setPlaced(n);
  }

  function doReroll() {
    if (rerollsLeft <= 0) return;
    setCard(buildCard(board.size, board.universe));
    setRerollsLeft(r => r - 1);
  }

  return (
    <div className="screen">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 8, letterSpacing: ".3em", color: "var(--mut)" }}>PREPARE RUN</div>
          <div style={{ fontSize: 8, color: "var(--mut)", marginTop: 3 }}>◈ {frags}  ·  {st.slots} slot{st.slots !== 1 ? "s" : ""}  ·  {usedSlots} placed</div>
        </div>
        <Btn label="← BACK" ghost sm onClick={onBack} />
      </div>

      {ownedBs.length > 1 && (
        <Panel style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 8, letterSpacing: ".3em", color: "var(--mut)", marginBottom: 9 }}>BOARD</div>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            {ownedBs.map(bd => {
              const active = bd.id === boardId;
              return (
                <button
                  key={bd.id}
                  className="board-tab"
                  style={{
                    borderColor: active ? bd.color + "77" : "rgba(255,255,255,.04)",
                    background: active ? bd.color + "1a" : "rgba(255,255,255,.018)",
                    color: active ? bd.color : "var(--mut)",
                    boxShadow: active ? `0 0 12px ${bd.color}22` : undefined,
                  }}
                  onClick={() => {
                    setBoardId(bd.id);
                    setPlaced({});
                    setCard(buildCard(bd.size, bd.universe));
                  }}
                >
                  {bd.name}
                </button>
              );
            })}
          </div>
        </Panel>
      )}

      {ownedAs.length > 0 && (
        <Panel style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 8, letterSpacing: ".3em", color: "var(--mut)", marginBottom: 9 }}>
            ABILITIES <span style={{ fontSize: 7, opacity: 0.6 }}>— hold & place on card</span>
          </div>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            {ownedAs.map(ab => {
              const held = heldAb === ab.id;
              return (
                <button
                  key={ab.id}
                  className={"ab-chip" + (held ? " held" : "")}
                  style={{
                    borderColor: held ? ab.color + "88" : ab.color + "25",
                    background: held ? ab.color + "20" : "rgba(255,255,255,.018)",
                    color: held ? ab.color : "var(--mut)",
                    boxShadow: held ? `0 0 14px ${ab.color}28` : undefined,
                  }}
                  onClick={() => setHeldAb(held ? null : ab.id)}
                >
                  {ab.icon} {ab.name}
                </button>
              );
            })}
          </div>
          {heldData && (
            <div style={{ marginTop: 8, fontSize: 8, color: heldData.color, letterSpacing: ".08em", opacity: 0.85 }}>
              {heldData.icon} {heldData.desc}
            </div>
          )}
        </Panel>
      )}

      <Panel style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 8, letterSpacing: ".3em", color: "var(--mut)" }}>CARD PREVIEW</div>
          {st.rerolls > 0 && (
            <button
              className="btn btn-sm"
              disabled={rerollsLeft <= 0}
              onClick={doReroll}
              style={{
                borderColor: rerollsLeft > 0 ? "rgba(200,200,200,.35)" : "var(--bdr)",
                border: "1px solid",
                color: rerollsLeft > 0 ? "var(--acc)" : "var(--mut)",
              }}
            >
              ↺ REROLL ({rerollsLeft})
            </button>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="card-grid" style={{ gridTemplateColumns: `repeat(${board.size},${cw}px)`, gap: 5 }}>
            {card && card.map((num, i) => {
              const isFree = i === fi;
              const ab = placed[i];
              const abData = ab ? ABILITIES.find(a => a.id === ab) : null;
              return (
                <div
                  key={i}
                  className="cell"
                  onClick={() => clickCell(i)}
                  style={{
                    width: cw,
                    height: cw,
                    background: isFree ? "rgba(255,255,255,.04)" : abData ? abData.color + "18" : "var(--sur)",
                    borderColor: isFree ? "rgba(255,255,255,.05)" : abData ? abData.color + "50" : "var(--bdr)",
                    boxShadow: abData ? `0 0 10px ${abData.color}20` : undefined,
                  }}
                >
                  {abData && <span className="cell-ab-icon" style={{ color: abData.color }}>{abData.icon}</span>}
                  {isFree
                    ? <span className="cell-free">FREE</span>
                    : <span className="cell-num" style={{ fontSize: board.size >= 4 ? 13 : 18, color: abData ? abData.color : "var(--mut)" }}>{num}</span>
                  }
                </div>
              );
            })}
          </div>
        </div>
      </Panel>

      {ownedAs.length === 0 && (
        <div style={{ textAlign: "center", fontSize: 8, color: "var(--mut)", letterSpacing: ".2em", margin: "10px 0 14px", opacity: 0.6 }}>
          UNLOCK ABILITIES FROM THE META SCREEN
        </div>
      )}
      <Btn label="▶  LAUNCH RUN" primary full onClick={onLaunch} style={{ marginTop: 4 }} />
    </div>
  );
}
