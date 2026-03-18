"use client";

interface XpBarProps {
  pct: number;
}

export default function XpBar({ pct }: XpBarProps) {
  return (
    <div className="xp-bar-track">
      <div className="xp-bar-fill" style={{ width: `${pct * 100}%` }} />
    </div>
  );
}
