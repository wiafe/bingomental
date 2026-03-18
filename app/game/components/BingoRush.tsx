"use client";

import useGameState from "../hooks/useGameState";
import MetaScreen from "./MetaScreen";
import PrepScreen from "./PrepScreen";
import RunScreen from "./RunScreen";
import ResultScreen from "./ResultScreen";

export default function BingoRush() {
  const g = useGameState();

  return (
    <div className="app">
      {g.phase === "meta" && (
        <MetaScreen
          xp={g.xp} frags={g.frags} runs={g.runs} bestRun={g.bestRun}
          unlocked={g.unlocked} onBuy={g.buyNode} onPrepare={g.goPrep}
        />
      )}
      {g.phase === "prep" && g.card && (
        <PrepScreen
          frags={g.frags} unlocked={g.unlocked}
          boardId={g.boardId} setBoardId={g.setBoardId}
          placed={g.placed} setPlaced={g.setPlaced}
          card={g.card} setCard={g.setCard}
          rerollsLeft={g.rerollsLeft} setRerollsLeft={g.setRerollsLeft}
          onLaunch={g.startRun} onBack={() => g.setPhase("meta")}
        />
      )}
      {g.phase === "run" && g.card && (
        <RunScreen
          board={g.board} card={g.card} daubed={g.daubed} called={g.called}
          lastNum={g.lastNum} donePats={g.donePats} runCoins={g.runCoins}
          evLog={g.evLog} flashI={g.flashI} bombSet={g.bombSet}
          placed={g.placed} effectivePool={g.effectivePool}
          celebration={g.celebration}
          highlightCells={g.highlightCells}
        />
      )}
      {g.phase === "result" && g.result && (
        <ResultScreen
          result={g.result} xp={g.xp} frags={g.frags}
          onHub={() => g.setPhase("meta")} onNext={g.goNextRun}
        />
      )}
    </div>
  );
}
