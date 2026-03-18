"use client";

import type { TLNodeData } from "../types";

interface TLNodeProps {
  node: TLNodeData | null;
  unlockLv: number;
  reverse: boolean;
  level: number;
  frags: number;
  onBuy: (node: TLNodeData) => void;
}

export default function TLNode({ node, unlockLv, reverse, level, frags, onBuy }: TLNodeProps) {
  if (!node) return <div style={{ flex: 1 }} />;

  const owned = node._owned;
  const avail = level >= unlockLv && !owned;
  const afford = frags >= node.cost;
  const buyable = avail && afford;
  const c = node.color;

  return (
    <div
      className={"tl-node" + (reverse ? " reverse" : "") + (buyable ? " buyable" : "") + (owned ? " owned" : "")}
      style={{
        borderColor: owned ? c + "40" : avail && afford ? c + "25" : undefined,
        background: owned ? c + "15" : avail && afford ? c + "08" : undefined,
        boxShadow: owned ? `0 0 10px ${c}15` : undefined,
      }}
      onClick={buyable ? () => onBuy(node) : undefined}
    >
      <div className="tl-node-header" style={{ color: owned ? c : avail ? c + "99" : "#1a2535" }}>
        <span>{node.icon}</span>
        <span>{node.label}</span>
        {owned && <span style={{ opacity: 0.6, marginLeft: 3, fontSize: 7 }}>✓</span>}
      </div>
      <div className="tl-node-sub" style={{ color: owned ? "rgba(255,255,255,.25)" : avail ? "rgba(255,255,255,.18)" : "#0e1a28" }}>
        {node.sub}
      </div>
      {!owned && (
        <div className="tl-node-cost" style={{ color: level < unlockLv ? "#0d1620" : afford ? c + "cc" : "#f87171aa" }}>
          {level < unlockLv ? `LV ${unlockLv}` : node.cost === 0 ? "FREE" : `◈ ${node.cost}`}
        </div>
      )}
    </div>
  );
}
