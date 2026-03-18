"use client";

import type { CSSProperties } from "react";

interface BtnProps {
  label: string;
  onClick?: () => void;
  primary?: boolean;
  ghost?: boolean;
  full?: boolean;
  sm?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
}

export default function Btn({ label, onClick, primary = false, ghost = false, full = false, sm = false, disabled = false, style = {} }: BtnProps) {
  const cls = [
    "btn",
    primary && "btn-primary",
    ghost && "btn-ghost",
    full && "btn-full",
    sm && "btn-sm",
  ].filter(Boolean).join(" ");

  return (
    <button className={cls} onClick={onClick} disabled={disabled} style={style}>
      {label}
    </button>
  );
}
