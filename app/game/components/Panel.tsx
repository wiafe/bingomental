"use client";

import type { CSSProperties, ReactNode } from "react";

interface PanelProps {
  children: ReactNode;
  style?: CSSProperties;
}

export default function Panel({ children, style = {} }: PanelProps) {
  return (
    <div className="panel" style={style}>
      {children}
    </div>
  );
}
