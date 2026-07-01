import React from "react";

export default function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Top-right — emerald accent glow */}
      <div
        className="absolute -top-28 -right-28 w-80 h-80 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 28%, #34d399 0%, #059669 35%, #064e3b 65%, #022c22 100%)",
          boxShadow:
            "inset -16px -16px 36px rgba(0,0,0,0.6), inset 7px 7px 20px rgba(52,211,153,0.12)",
          opacity: 0.55,
        }}
      />
      {/* Bottom-left — indigo tint for contrast */}
      <div
        className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 35% 32%, #6366f1 0%, #4f46e5 40%, #1e1b4b 80%, #0f0c29 100%)",
          boxShadow:
            "inset -10px -10px 26px rgba(0,0,0,0.55), inset 5px 5px 14px rgba(99,102,241,0.1)",
          opacity: 0.35,
        }}
      />
      {/* Small highlight sphere top-left */}
      <div
        className="absolute top-8 left-8 w-14 h-14 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 35% 33%, #a7f3d0 0%, #34d399 55%, #059669 100%)",
          boxShadow: "inset -5px -5px 12px rgba(0,0,0,0.4)",
          opacity: 0.3,
        }}
      />
      {/* Ambient glow pools */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 90% 5%, rgba(52,211,153,0.12) 0%, transparent 60%)," +
            "radial-gradient(ellipse 50% 45% at 5% 90%, rgba(99,102,241,0.1) 0%, transparent 60%)",
        }}
      />
    </div>
  );
}
