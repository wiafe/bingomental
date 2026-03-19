"use client";

import { useState } from "react";
import { BOARDS, ABILITIES } from "../constants";
import { deriveStats, getCellWidth } from "../helpers";
import Panel from "./Panel";
import Btn from "./Btn";
import { sfxHover, sfxClick, sfxPlace, sfxRemove, sfxReroll, sfxTab, sfxLaunch, sfxBack } from "../sfx";

interface PrepScreenProps {
  frags: number;
  unlocked: Set<string>;
  boardId: string;
  switchBoard: (id: string) => void;
  placed: Record<number, string>;
  setPlaced: (p: Record<number, string>) => void;
  card: number[];
  rerollsLeft: number;
  doReroll: () => void;
  getNumStats: (boardId: string, num: number) => { called: number; appeared: number } | null;
  onLaunch: () => void;
  onBack: () => void;
}

export default function PrepScreen({ frags, unlocked, boardId, switchBoard, placed, setPlaced, card, rerollsLeft, doReroll, getNumStats, onLaunch, onBack }: PrepScreenProps) {
  const [heldAb, setHeldAb] = useState<string | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const st = deriveStats(unlocked);
  const board = BOARDS.find(b => b.id === boardId) || BOARDS[0];
  const ownedBs = BOARDS.filter(b => unlocked.has(b.id));
  const ownedAs = ABILITIES.filter(a => unlocked.has(a.id));
  const heldData = heldAb ? ABILITIES.find(a => a.id === heldAb) : null;
  const usedSlots = Object.keys(placed).length;
  const cw = getCellWidth(board.size);

  function clickCell(idx: number) {
    if (!heldAb) {
      if (placed[idx]) {
        sfxRemove();
        const n = { ...placed };
        delete n[idx];
        setPlaced(n);
      } else {
        sfxClick();
      }
      return;
    }
    const n = { ...placed };
    if (n[idx] === heldAb) {
      sfxRemove();
      delete n[idx];
    } else {
      if (usedSlots >= st.slots && !n[idx]) return;
      sfxPlace();
      n[idx] = heldAb;
    }
    setPlaced(n);
  }

  const hoveredNum = hoverIdx !== null ? card[hoverIdx] : null;
  const hoveredStats = hoveredNum !== null ? getNumStats(boardId, hoveredNum) : null;
  const hoveredAb = hoverIdx !== null && placed[hoverIdx] ? ABILITIES.find(a => a.id === placed[hoverIdx]) : null;

  return (
    <div className="screen">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 12, letterSpacing: ".3em", color: "var(--mut)" }}>PREPARE RUN</div>
          <div style={{ fontSize: 12, color: "var(--mut)", marginTop: 3 }}>◈ {frags}  ·  {st.slots} slot{st.slots !== 1 ? "s" : ""}  ·  {usedSlots} placed</div>
        </div>
        <Btn label="← BACK" ghost sm onClick={() => { sfxBack(); onBack(); }} />
      </div>

      {ownedBs.length > 1 && (
        <Panel style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 12, letterSpacing: ".3em", color: "var(--mut)", marginBottom: 9 }}>BOARD</div>
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
                  onClick={() => { sfxTab(); switchBoard(bd.id); }}
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
          <div style={{ fontSize: 12, letterSpacing: ".3em", color: "var(--mut)", marginBottom: 9 }}>
            ABILITIES <span style={{ fontSize: 11, opacity: 0.6 }}>— hold & place on card</span>
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
                  onClick={() => { sfxClick(); setHeldAb(held ? null : ab.id); }}
                >
                  {ab.icon} {ab.name}
                </button>
              );
            })}
          </div>
          {heldData && (
            <div style={{ marginTop: 8, fontSize: 12, color: heldData.color, letterSpacing: ".08em", opacity: 0.85 }}>
              {heldData.icon} {heldData.desc}
            </div>
          )}
        </Panel>
      )}

      <Panel style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 12, letterSpacing: ".3em", color: "var(--mut)" }}>CARD PREVIEW</div>
          {st.rerolls > 0 && (
            <button
              className="btn btn-sm"
              disabled={rerollsLeft <= 0}
              onClick={() => { sfxReroll(); doReroll(); }}
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
            {card.map((num, i) => {
              const ab = placed[i];
              const abData = ab ? ABILITIES.find(a => a.id === ab) : null;
              const isAnchor = ab === "anchor";
              return (
                <div
                  key={i}
                  className="cell"
                  onClick={() => clickCell(i)}
                  onMouseEnter={() => { sfxHover(); setHoverIdx(i); }}
                  onMouseLeave={() => setHoverIdx(null)}
                  style={{
                    width: cw,
                    height: cw,
                    background: isAnchor ? "rgba(255,255,255,.1)" : abData ? abData.color + "18" : "var(--sur)",
                    borderColor: isAnchor ? "rgba(255,255,255,.3)" : abData ? abData.color + "50" : "var(--bdr)",
                    boxShadow: abData ? `0 0 10px ${abData.color}20` : undefined,
                  }}
                >
                  {abData && <span className="cell-ab-icon" style={{ color: abData.color }}>{abData.icon}</span>}
                  {isAnchor
                    ? <span className="cell-free">FREE</span>
                    : <span className="cell-num" style={{ fontSize: board.size >= 4 ? 16 : 22, color: abData ? abData.color : "var(--mut)" }}>{num}</span>
                  }
                </div>
              );
            })}
          </div>
        </div>

        {/* Tooltip */}
        <div style={{
          minHeight: 38, marginTop: 10, padding: "6px 10px",
          borderRadius: 8, background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.06)",
          fontSize: 12, color: "var(--mut)", letterSpacing: ".06em",
          transition: "opacity .15s", opacity: hoverIdx !== null ? 1 : 0.4,
        }}>
          {hoverIdx !== null && hoveredNum !== null ? (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <div>
                <span style={{ fontSize: 16, fontWeight: 700, color: "var(--acc)", marginRight: 8 }}>{hoveredNum}</span>
                {hoveredAb && <span style={{ color: hoveredAb.color }}>{hoveredAb.icon} {hoveredAb.name}</span>}
              </div>
              <div style={{ textAlign: "right", fontSize: 11, lineHeight: 1.6 }}>
                {hoveredStats ? (
                  <>
                    <div>appeared <span style={{ color: "var(--acc)" }}>{hoveredStats.appeared}×</span></div>
                    <div>called <span style={{ color: "var(--acc)" }}>{hoveredStats.called}×</span> · hit rate <span style={{ color: hoveredStats.appeared > 0 ? "var(--acc)" : "var(--mut)" }}>{hoveredStats.appeared > 0 ? Math.round((hoveredStats.called / hoveredStats.appeared) * 100) : 0}%</span></div>
                  </>
                ) : (
                  <div style={{ opacity: 0.5 }}>no data yet</div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ opacity: 0.5, fontSize: 11 }}>hover a cell for stats</div>
          )}
        </div>
      </Panel>

      <Btn label="▶  LAUNCH RUN" primary full onClick={() => { sfxLaunch(); onLaunch(); }} style={{ marginTop: 4 }} />
    </div>
  );
}
