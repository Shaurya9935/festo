import React from "react";
import { Inter } from "next/font/google";
import FloatingOrbs from "@/components/FloatingOrbs";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${inter.variable} min-h-screen w-full flex items-center justify-center p-4`}
      style={{
        background: "linear-gradient(135deg, #0a0f0e 0%, #0d1117 50%, #0a0c10 100%)",
        fontFamily: "var(--font-inter), 'Inter', sans-serif",
      }}
    >
      {/* Subtle grid pattern overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(52,211,153,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, rgba(17,24,39,0.97) 0%, rgba(15,20,28,0.99) 100%)",
          border: "1px solid rgba(52,211,153,0.12)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.04), 0 32px 64px rgba(0,0,0,0.7), 0 8px 24px rgba(0,0,0,0.5)",
          backdropFilter: "blur(16px)",
        }}
      >
        <FloatingOrbs />

        {/* Emerald top-border accent */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(52,211,153,0.6) 40%, rgba(16,185,129,0.5) 60%, transparent 100%)",
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2.5 px-8 pt-7 pb-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #34d399 0%, #059669 100%)",
              boxShadow: "0 2px 12px rgba(52,211,153,0.4)",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 7L5.5 10.5L12 3.5"
                stroke="#022c22"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span
            className="text-lg font-semibold tracking-tight"
            style={{ color: "#f9fafb" }}
          >
            Festo
          </span>
        </div>

        {/* Form */}
        <div className="relative z-10 px-8 py-6">{children}</div>
      </div>
    </div>
  );
}
