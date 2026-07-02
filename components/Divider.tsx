import React from "react";

export default function Divider({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px" style={{ background: "rgba(149,1,1,0.2)" }} />
      <span className="text-xs font-medium" style={{ color: "#6b7280" }}>
        {text}
      </span>
      <div className="flex-1 h-px" style={{ background: "rgba(149,1,1,0.2)" }} />
    </div>
  );
}
