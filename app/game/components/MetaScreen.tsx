"use client";

import { TL } from "../constants";
import { levelOf, xpProg } from "../helpers";
import type { TLNodeData } from "../types";
import Panel from "./Panel";
import Btn from "./Btn";
import XpBar from "./XpBar";
import TLNodeComp from "./TLNode";

interface MetaScreenProps {
  xp: number;
  frags: number;
  runs: number;
  bestRun: number;
  unlocked: Set<string>;
  onBuy: (node: TLNodeData) => void;
  onPrepare: () => void;
}

const SPINE_DIM = "rgba(255,255,255,.06)";

export default function MetaScreen({ xp, frags, runs, bestRun, unlocked, onBuy, onPrepare }: MetaScreenProps) {
  const lv = levelOf(xp);
  const xp_ = xpProg(xp);

  const withOwned = (node: TLNodeData | null) => node ? { ...node, _owned: unlocked.has(node.id) } : null;

  return (
    <div className="screen">
      {/* Stats */}
      <Panel>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: lv < 10 ? "12px" : "4px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 12, letterSpacing: ".3em", color: "var(--mut)" }}>LV</span>
            <span style={{ fontFamily: "var(--display)", fontSize: 36, fontWeight: 900, color: "var(--acc)", lineHeight: 1 }}>{lv}</span>
          </div>
          <div style={{ display: "flex", gap: 18 }}>
            {([["FRAGS", `◈ ${frags}`, "#e8e8e8"], ["BEST", bestRun, "var(--txt)"], ["RUNS", runs, "var(--txt)"]] as const).map(([l, v, c]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, letterSpacing: ".25em", color: "var(--mut)", marginBottom: 2 }}>{l}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: c }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        {lv < 10 ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--mut)", letterSpacing: ".1em", marginBottom: 5 }}>
              <span>XP → LV {lv + 1}</span>
              <span>{xp_.cur} / {xp_.need}</span>
            </div>
            <XpBar pct={xp_.pct} />
          </>
        ) : (
          <div style={{ fontSize: 14, color: "var(--gold)", letterSpacing: ".2em", fontWeight: 700, marginTop: 4 }}>★ MAX LEVEL</div>
        )}
      </Panel>

      {/* CTA */}
      <Btn label="▶  PREPARE RUN" primary full onClick={onPrepare} style={{ marginTop: 14, marginBottom: 14 }} />

      {/* Track labels */}
      <div style={{ display: "flex", marginBottom: 4 }}>
        <div style={{ flex: 1, textAlign: "right", fontSize: 11, letterSpacing: ".3em", color: "rgba(255,255,255,.18)", paddingRight: 6 }}>BOARDS</div>
        <div style={{ width: 58 }} />
        <div style={{ flex: 1, fontSize: 11, letterSpacing: ".3em", color: "rgba(255,255,255,.18)", paddingLeft: 6 }}>ABILITIES · UPGRADES</div>
      </div>

      {/* Timeline */}
      <div className="timeline">
        {TL.map((row, idx) => {
          const isUnlocked = lv >= row.lv;
          const isCurrent = lv === row.lv;
          const hasCtr = !!row.ctr;
          const ctrOwned = row.ctr && unlocked.has(row.ctr.id);
          const ctrAvail = row.ctr && isUnlocked && !ctrOwned;
          const ctrAfford = row.ctr && frags >= row.ctr.cost;
          const ctrBuyable = ctrAvail && ctrAfford;

          return (
            <div key={row.lv} className={"tl-row" + (hasCtr ? " has-ctr" : "")}>
              {/* LEFT */}
              <div className="tl-left">
                {row.lft && (
                  <>
                    <TLNodeComp node={withOwned(row.lft)} unlockLv={row.lv} reverse level={lv} frags={frags} onBuy={onBuy} />
                    <div className="tl-connector" style={{ background: unlocked.has(row.lft?.id) ? row.lft.color + "44" : SPINE_DIM }} />
                  </>
                )}
              </div>

              {/* CENTER */}
              <div className="tl-center">
                <div className={"tl-spine tl-spine-top " + (idx === 0 ? "" : lv > row.lv ? "spine-lit" : "spine-dim")} />
                <div className={"tl-spine tl-spine-bot " + (idx === TL.length - 1 ? "" : lv > row.lv ? "spine-lit" : "spine-dim")} />
                <div
                  className={"tl-dot" + (isCurrent ? " current" : isUnlocked ? " unlocked" : "")}
                  style={{ transform: `translateY(${hasCtr ? "-70%" : "-50%"})` }}
                >
                  {row.lv}
                </div>
                {hasCtr && row.ctr && (
                  <div
                    className={"tl-ctr-badge" + (ctrBuyable ? " buyable" : "")}
                    style={{
                      color: ctrOwned ? row.ctr.color : ctrAvail ? row.ctr.color + "aa" : "#0d1620",
                      background: ctrOwned ? row.ctr.color + "13" : ctrAvail ? "rgba(255,255,255,.04)" : "rgba(255,255,255,.01)",
                      borderColor: ctrOwned ? row.ctr.color + "30" : ctrAvail ? "rgba(255,255,255,.1)" : "rgba(255,255,255,.03)",
                    }}
                    onClick={ctrBuyable ? () => onBuy(row.ctr!) : undefined}
                  >
                    {row.ctr.icon} {row.ctr.label}
                    {ctrOwned && <span style={{ opacity: 0.55, marginLeft: 2 }}>✓</span>}
                    {!ctrOwned && (
                      <div style={{ fontSize: 11, color: isUnlocked ? (ctrAfford ? row.ctr.color + "bb" : "#f87171aa") : "#0d1620", letterSpacing: ".12em", marginTop: 1 }}>
                        {isUnlocked ? (row.ctr.cost === 0 ? "FREE" : `◈ ${row.ctr.cost}`) : `LV ${row.lv}`}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* RIGHT */}
              <div className="tl-right">
                {row.rgt && (
                  <>
                    <div className="tl-connector" style={{ background: unlocked.has(row.rgt?.id) ? row.rgt.color + "44" : SPINE_DIM }} />
                    <TLNodeComp node={withOwned(row.rgt)} unlockLv={row.lv} reverse={false} level={lv} frags={frags} onBuy={onBuy} />
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
