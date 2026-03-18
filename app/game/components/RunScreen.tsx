"use client";

import { ABILITIES } from "../constants";
import { freeCell, buildPats, getCellWidth } from "../helpers";
import type { Board, EventLogEntry } from "../types";

interface RunScreenProps {
  board: Board;
  card: (number | null)[];
  daubed: Set<number>;
  called: number[];
  lastNum: number | null;
  donePats: Set<string>;
  runCoins: number;
  evLog: EventLogEntry[];
  flashI: number;
  bombSet: Set<number>;
  placed: Record<number, string>;
  effectivePool: number;
}

export default function RunScreen({ board, card, daubed, called, lastNum, donePats, runCoins, evLog, flashI, bombSet, placed, effectivePool }: RunScreenProps) {
  const fi = freeCell(board.size);
  const cnt = called.length;
  const pats = buildPats(board.size);
  const cw = getCellWidth(board.size);

  return (
    <div className="screen">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 8, letterSpacing: ".3em", color: "var(--mut)" }}>RUNNING</div>
          <div style={{ fontFamily: "var(--display)", fontSize: 18, fontWeight: 700, letterSpacing: ".08em", color: board.color }}>{board.name}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 8, letterSpacing: ".25em", color: "var(--mut)" }}>COINS</div>
          <div style={{ fontFamily: "var(--display)", fontSize: 26, fontWeight: 900, color: "var(--gold)", lineHeight: 1 }}>{runCoins}</div>
        </div>
      </div>

      {/* Pool bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8, color: "var(--mut)", marginBottom: 4, letterSpacing: ".1em" }}>
          <span>CALLS</span>
          <span>{cnt}/{effectivePool}</span>
        </div>
        <div className="pool-track">
          <div className="pool-fill" style={{ width: `${(cnt / effectivePool) * 100}%`, background: board.color }} />
        </div>
      </div>

      {/* Call display row */}
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{
          width: 72, height: 72, flexShrink: 0, borderRadius: 12,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: lastNum ? board.color + "22" : "var(--sur)",
          border: `2px solid ${lastNum ? board.color + "66" : "var(--bdr)"}`,
          boxShadow: lastNum ? `0 0 24px ${board.color}44` : "none",
        }}>
          {lastNum
            ? <div key={lastNum} style={{ fontFamily: "var(--display)", fontSize: 28, fontWeight: 900, color: board.color, lineHeight: 1, animation: "numPop .22s ease" }}>{lastNum}</div>
            : <div style={{ fontSize: 10, color: "var(--mut)", animation: "blink 1s infinite" }}>···</div>
          }
        </div>
        <div style={{ flex: 1, display: "flex", flexWrap: "wrap", gap: 3, alignContent: "flex-start" }}>
          {called.slice(1, 12).map((n, i) => (
            <div key={i} className="called-num" style={{ color: `rgba(207,216,232,${Math.max(0.07, 0.38 - i * 0.03)})` }}>{n}</div>
          ))}
        </div>
        <div style={{ width: 108, flexShrink: 0, textAlign: "right" }}>
          {evLog.slice(0, 4).map((ev, i) => (
            <div key={ev.id} className="ev-line" style={{
              animation: i === 0 ? "evIn .2s ease" : "none",
              color: i === 0 ? "var(--gold)" : `rgba(232,232,232,${0.28 - i * 0.06})`,
            }}>{ev.coins > 0 && `+${ev.coins} `}{ev.text}</div>
          ))}
        </div>
      </div>

      {/* Card */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
        <div className="card-grid" style={{ gridTemplateColumns: `repeat(${board.size},${cw}px)`, gap: 6 }}>
          {card && card.map((num, i) => {
            const isFree = i === fi;
            const isD = daubed.has(i);
            const isF = flashI === i;
            const isB = bombSet.has(i);
            const ab = placed[i];
            const abData = ab ? ABILITIES.find(a => a.id === ab) : null;
            return (
              <div
                key={i}
                className={"cell" + (isD ? " daubed" : "") + (isF ? " flash" : "") + (isB ? " bomb-anim" : "")}
                style={{
                  width: cw, height: cw,
                  background: isD ? (isFree ? "rgba(255,255,255,.08)" : abData ? abData.color + "2e" : "rgba(255,255,255,.1)") : "var(--sur)",
                  borderColor: isD ? (abData ? abData.color + "77" : "rgba(255,255,255,.28)") : "var(--bdr)",
                  boxShadow: isF ? "0 0 22px rgba(255,255,255,.4)" : isB ? "0 0 16px #b0b0b0" : isD && !isFree ? "0 0 8px rgba(255,255,255,.15)" : "none",
                  cursor: "default",
                }}
              >
                {abData && <span className="cell-ab-icon" style={{ color: isD ? abData.color : abData.color + "66" }}>{abData.icon}</span>}
                {isFree
                  ? <span className="cell-free">FREE</span>
                  : <span className="cell-num" style={{ fontSize: board.size >= 4 ? 14 : 20, color: isD ? (abData ? abData.color : "#d8d8d8") : "var(--mut)" }}>{num}</span>
                }
              </div>
            );
          })}
        </div>
      </div>

      {/* Patterns */}
      {donePats.size > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>
          {[...donePats].map(pid => {
            const pat = pats.find(p => p.id === pid);
            return pat ? <span key={pid} className="pat-chip">{pat.name}</span> : null;
          })}
        </div>
      )}
    </div>
  );
}
