import React from "react";

export default function Divider({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px" style={{ background: "rgba(156,176,128,0.14)" }} />
      <span className="text-xs" style={{ color: "#618764" }}>{text}</span>
      <div className="flex-1 h-px" style={{ background: "rgba(156,176,128,0.14)" }} />
    </div>
  );
}
