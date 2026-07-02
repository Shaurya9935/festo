import React from "react";

export default function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Top-right — crimson accent glow */}
      <div
        className="absolute -top-28 -right-28 w-80 h-80 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 28%, #FF0000 0%, #950101 35%, #3D0000 65%, #000000 100%)",
          boxShadow:
            "inset -16px -16px 36px rgba(0,0,0,0.6), inset 7px 7px 20px rgba(255,0,0,0.12)",
          opacity: 0.55,
        }}
      />
      {/* Bottom-left — deep red for contrast */}
      <div
        className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 35% 32%, #950101 0%, #3D0000 40%, #1a0000 80%, #000000 100%)",
          boxShadow:
            "inset -10px -10px 26px rgba(0,0,0,0.55), inset 5px 5px 14px rgba(149,1,1,0.1)",
          opacity: 0.4,
        }}
      />
      {/* Small highlight sphere top-left */}
      <div
        className="absolute top-8 left-8 w-14 h-14 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 35% 33%, #FF0000 0%, #950101 55%, #3D0000 100%)",
          boxShadow: "inset -5px -5px 12px rgba(0,0,0,0.4)",
          opacity: 0.3,
        }}
      />
      {/* Ambient glow pools */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 90% 5%, rgba(255,0,0,0.1) 0%, transparent 60%)," +
            "radial-gradient(ellipse 50% 45% at 5% 90%, rgba(149,1,1,0.08) 0%, transparent 60%)",
        }}
      />
    </div>
  );
}
