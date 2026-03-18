"use client";

import { BOARDS } from "../constants";
import { levelOf, xpProg, buildPats } from "../helpers";
import type { RunResult } from "../types";
import Panel from "./Panel";
import Btn from "./Btn";
import XpBar from "./XpBar";

interface ResultScreenProps {
  result: RunResult;
  xp: number;
  frags: number;
  onHub: () => void;
  onNext: () => void;
}

export default function ResultScreen({ result, xp, frags, onHub, onNext }: ResultScreenProps) {
  const rBoard = BOARDS.find(b => b.id === result.boardId);
  const lv = levelOf(xp);
  const xp_ = xpProg(xp);
  const pats = rBoard ? buildPats(rBoard.size) : [];

  return (
    <div className="screen">
      <div style={{ textAlign: "center", marginBottom: 20, animation: "fadeUp .45s ease" }}>
        <div style={{ fontSize: 8, letterSpacing: ".4em", color: "var(--mut)", marginBottom: 8 }}>{result.boardName} COMPLETE</div>
        <div style={{ fontFamily: "var(--display)", fontSize: 52, fontWeight: 900, color: "var(--gold)", lineHeight: 1, animation: "coinIn .5s ease,gPulse 2.5s .5s infinite" }}>{result.coins}</div>
        <div style={{ fontSize: 9, color: "var(--mut)", letterSpacing: ".3em", marginTop: 8 }}>COINS EARNED</div>
        {result.isNew && (
          <div style={{ display: "inline-block", marginTop: 10, padding: "3px 12px", borderRadius: 5, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.2)", fontSize: 10, letterSpacing: ".2em", color: "#c8c8c8", fontWeight: 700 }}>
            ★ NEW BEST ★
          </div>
        )}
      </div>

      <Panel style={{ marginBottom: 10, animation: "fadeUp .4s .05s both" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 8, letterSpacing: ".3em", color: "var(--mut)", marginBottom: 4 }}>FRAGMENTS EARNED</div>
            <div style={{ fontFamily: "var(--display)", fontSize: 22, fontWeight: 700, color: "var(--gold)" }}>◈ +{result.rawFrags}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 7, color: "var(--mut)", letterSpacing: ".15em" }}>total</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(232,232,232,.6)" }}>◈ {frags}</div>
          </div>
        </div>
      </Panel>

      {result.lvUp && (
        <Panel style={{ marginBottom: 10, background: "rgba(255,255,255,.03)", borderColor: "rgba(255,255,255,.12)", animation: "fadeUp .5s .1s both" }}>
          <div style={{ fontFamily: "var(--display)", fontSize: 14, fontWeight: 700, letterSpacing: ".08em", color: "#c0c0c0", animation: "lvPop .5s .3s ease", marginBottom: 5 }}>
            ⬆ LEVEL {result.newLv}
          </div>
          <div style={{ fontSize: 9, color: "#a0a0a0", letterSpacing: ".1em" }}>New nodes available on the progression tree</div>
        </Panel>
      )}

      <Panel style={{ marginBottom: 10, animation: "fadeUp .5s .15s both" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8, color: "var(--mut)", letterSpacing: ".18em", marginBottom: 5 }}>
          <span>XP GAINED</span>
          <span style={{ color: "var(--acc)" }}>+{result.xpGain}</span>
        </div>
        <XpBar pct={xp_.pct} />
        <div style={{ fontSize: 8, color: "var(--mut)", marginTop: 5, letterSpacing: ".1em" }}>Level {lv}  ·  {xp_.cur}/{xp_.need} XP</div>
      </Panel>

      {result.pats.length > 0 && (
        <Panel style={{ marginBottom: 16, animation: "fadeUp .5s .2s both" }}>
          <div style={{ fontSize: 8, letterSpacing: ".3em", color: "var(--mut)", marginBottom: 8 }}>PATTERNS HIT</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {result.pats.map(pid => {
              const pat = pats.find(p => p.id === pid);
              return pat ? <span key={pid} className="pat-chip" style={{ animation: "none" }}>{pat.name}</span> : null;
            })}
          </div>
        </Panel>
      )}

      <div style={{ display: "flex", gap: 8, animation: "fadeUp .5s .28s both" }}>
        <Btn label="← HUB" ghost sm onClick={onHub} />
        <Btn label="▶  NEXT RUN" primary onClick={onNext} style={{ flex: 1 }} />
      </div>
    </div>
  );
}
