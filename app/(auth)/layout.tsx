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
        background: "linear-gradient(145deg, #1e2a2e 0%, #273338 50%, #1e2a2e 100%)",
        fontFamily: "var(--font-inter), 'Inter', sans-serif",
      }}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, rgba(43,87,72,0.45) 0%, rgba(39,51,56,0.9) 60%)",
          border: "1px solid rgba(156,176,128,0.14)",
          boxShadow:
            "0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(156,176,128,0.05), inset 0 1px 0 rgba(200,216,176,0.07)",
          backdropFilter: "blur(12px)",
        }}
      >
        <FloatingOrbs />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2 px-8 pt-7 pb-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #9cb080 0%, #2b5748 100%)",
              boxShadow: "0 2px 10px rgba(97,135,100,0.35)",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 7L5.5 10.5L12 3.5"
                stroke="#1a2820"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight" style={{ color: "#e8ede6" }}>
            Festo
          </span>
        </div>

        {/* Form */}
        <div className="relative z-10 px-8 py-6">
          {children}
        </div>
      </div>
    </div>
  );
}
