import React from "react";

export default function Divider({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 my-1">
      <div className="flex-1 h-px" style={{ background: "rgba(178,80,104,0.18)" }} />
      <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#9a8098" }}>
        {text}
      </span>
      <div className="flex-1 h-px" style={{ background: "rgba(178,80,104,0.18)" }} />
    </div>
  );
}
