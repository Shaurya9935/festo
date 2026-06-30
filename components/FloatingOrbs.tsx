import React from "react";

export default function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Large teal sphere, top-right */}
      <div
        className="absolute -top-20 -right-20 w-72 h-72 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 32% 30%, #618764 0%, #2b5748 45%, #1a3830 75%, #0f2218 100%)",
          boxShadow:
            "inset -14px -14px 32px rgba(0,0,0,0.55), inset 6px 6px 18px rgba(156,176,128,0.18)",
          opacity: 0.9,
        }}
      />
      {/* Medium sage sphere, bottom-left */}
      <div
        className="absolute -bottom-14 -left-14 w-52 h-52 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 35% 32%, #9cb080 0%, #618764 42%, #2b5748 72%, #1a3830 100%)",
          boxShadow:
            "inset -10px -10px 24px rgba(0,0,0,0.5), inset 5px 5px 14px rgba(200,220,180,0.15)",
          opacity: 0.75,
        }}
      />
      {/* Small accent sphere, top-left */}
      <div
        className="absolute top-10 left-10 w-16 h-16 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 35% 33%, #c8d8b0 0%, #9cb080 50%, #618764 100%)",
          boxShadow: "inset -5px -5px 12px rgba(0,0,0,0.45)",
          opacity: 0.45,
        }}
      />
      {/* Tiny sphere mid-right */}
      <div
        className="absolute top-1/2 -right-4 w-10 h-10 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 35% 35%, #618764 0%, #2b5748 100%)",
          opacity: 0.4,
        }}
      />
      {/* Ambient glow pools */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 85% 8%, rgba(97,135,100,0.18) 0%, transparent 65%)," +
            "radial-gradient(ellipse 45% 40% at 8% 85%, rgba(43,87,72,0.22) 0%, transparent 65%)",
        }}
      />
    </div>
  );
}
