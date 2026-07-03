import React from "react";
import { Inter } from "next/font/google";

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
      className={inter.variable}
      style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif" }}
    >
      {children}
    </div>
  );
}
