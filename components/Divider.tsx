import React from "react";

export default function Divider({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
      <span className="text-xs font-medium" style={{ color: "#4b5563" }}>
        {text}
      </span>
      <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
    </div>
  );
}
