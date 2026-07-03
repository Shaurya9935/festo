import React from "react";

// Light-theme orbs using the #4C3A51 / #774360 / #B25068 / #E7AB79 palette
export default function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Top-right — warm rose / amber glow */}
      <div
        className="absolute -top-28 -right-28 w-72 h-72 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 28%, #E7AB79 0%, #B25068 40%, #774360 70%, #4C3A51 100%)",
          boxShadow:
            "inset -12px -12px 28px rgba(76,58,81,0.3), inset 6px 6px 16px rgba(231,171,121,0.15)",
          opacity: 0.18,
        }}
      />
      {/* Bottom-left — plum / deep purple */}
      <div
        className="absolute -bottom-14 -left-14 w-52 h-52 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 35% 32%, #774360 0%, #4C3A51 50%, #2e2138 100%)",
          boxShadow:
            "inset -8px -8px 20px rgba(76,58,81,0.3), inset 4px 4px 10px rgba(119,67,96,0.1)",
          opacity: 0.12,
        }}
      />
      {/* Small highlight — amber */}
      <div
        className="absolute top-8 left-8 w-12 h-12 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 35% 33%, #E7AB79 0%, #B25068 60%, #774360 100%)",
          boxShadow: "inset -4px -4px 10px rgba(76,58,81,0.2)",
          opacity: 0.2,
        }}
      />
      {/* Ambient glow pools */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 92% 5%, rgba(178,80,104,0.07) 0%, transparent 60%)," +
            "radial-gradient(ellipse 50% 45% at 5% 90%, rgba(119,67,96,0.06) 0%, transparent 60%)",
        }}
      />
    </div>
  );
}
