"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import FloatingOrbs from "@/components/FloatingOrbs";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown]   = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const t = setTimeout(() => setCooldown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [cooldown]);

  const handleResend = async () => {
    if (!email) { toast.error("No email address found to resend to."); return; }
    setResending(true);
    try {
      const { error } = await authClient.sendVerificationEmail({
        email,
        callbackURL: window.location.origin + "/login",
      });
      if (error) toast.error(error.message || "Failed to resend verification email");
      else { toast.success("Verification email resent successfully!"); setCooldown(60); }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col items-center text-center gap-6 py-4">
      {/* Icon */}
      <div className="relative flex items-center justify-center">
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-25 animate-pulse"
          style={{ background: "radial-gradient(circle, #E7AB79 0%, #B25068 100%)" }}
        />
        <div
          className="relative w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(231,171,121,0.15) 0%, rgba(178,80,104,0.12) 100%)",
            border: "1px solid rgba(178,80,104,0.2)",
            boxShadow: "0 8px 32px rgba(76,58,81,0.08)",
          }}
        >
          <Mail className="w-8 h-8" style={{ color: "#B25068" }} />
        </div>
      </div>

      {/* Typography */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "#4C3A51", fontFamily: "'Hanken Grotesk', sans-serif" }}>
          Check your email
        </h1>
        <p className="text-sm px-2 leading-relaxed" style={{ color: "#9a8098" }}>
          We sent a verification link to your email address. Please click the link to verify your account and activate Festo.
        </p>
      </div>

      {/* Email pill */}
      {email && (
        <div
          className="px-3 py-1.5 rounded-full text-xs font-mono font-medium tracking-tight border max-w-full truncate"
          style={{
            background: "rgba(178,80,104,0.06)",
            border: "1px solid rgba(178,80,104,0.18)",
            color: "#774360",
          }}
          title={email}
        >
          {email}
        </div>
      )}

      {/* Divider */}
      <div className="w-full h-px" style={{ background: "linear-gradient(90deg, rgba(178,80,104,0) 0%, rgba(178,80,104,0.18) 50%, rgba(178,80,104,0) 100%)" }} />

      {/* Actions */}
      <div className="flex flex-col w-full gap-3">
        {email && (
          <button
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            className="flex items-center justify-center gap-2 text-sm font-medium transition-all py-2.5 rounded-xl disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #B25068 0%, #774360 100%)",
              color: "#ffffff",
              boxShadow: "0 4px 12px rgba(178,80,104,0.28)",
            }}
            onMouseEnter={(e) => { if (cooldown === 0 && !resending) (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.08)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.filter = "none"; }}
          >
            {resending ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
            {resending ? "Sending…" : cooldown > 0 ? `Resend Email (${cooldown}s)` : "Resend Verification Link"}
          </button>
        )}

        <Link
          href="/login"
          className="flex items-center justify-center gap-2 text-sm font-medium transition-colors py-2.5 rounded-xl border"
          style={{ color: "#774360", borderColor: "rgba(178,80,104,0.18)", background: "rgba(76,58,81,0.03)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#4C3A51"; e.currentTarget.style.borderColor = "rgba(178,80,104,0.3)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#774360"; e.currentTarget.style.borderColor = "rgba(178,80,104,0.18)"; }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #fdf5fa 0%, #f8f0f6 50%, #fdf5fa 100%)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Subtle grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(76,58,81,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(76,58,81,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Card */}
      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden"
        style={{
          background: "#ffffff",
          border: "1px solid rgba(178,80,104,0.18)",
          boxShadow:
            "0 0 0 1px rgba(76,58,81,0.04), 0 24px 56px rgba(76,58,81,0.12), 0 8px 20px rgba(178,80,104,0.08)",
        }}
      >
        <FloatingOrbs />

        {/* Top accent */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(178,80,104,0.6) 40%, rgba(231,171,121,0.5) 60%, transparent 100%)",
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2.5 px-8 pt-7 pb-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #B25068 0%, #774360 100%)",
              boxShadow: "0 2px 12px rgba(178,80,104,0.35)",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M2 7L5.5 10.5L12 3.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight" style={{ color: "#4C3A51" }}>Festo</span>
        </div>

        {/* Content */}
        <div className="relative z-10 px-8 py-6">
          <Suspense
            fallback={
              <div className="flex items-center justify-center p-8">
                <RefreshCw className="w-6 h-6 animate-spin" style={{ color: "#B25068" }} />
              </div>
            }
          >
            <VerifyEmailContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}