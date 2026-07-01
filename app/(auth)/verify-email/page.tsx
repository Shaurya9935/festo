"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResend = async () => {
    if (!email) {
      toast.error("No email address found to resend to.");
      return;
    }
    setResending(true);
    try {
      const { error } = await authClient.sendVerificationEmail({
        email: email,
        callbackURL: window.location.origin + "/login",
      });
      if (error) {
        toast.error(error.message || "Failed to resend verification email");
      } else {
        toast.success("Verification email resent successfully!");
        setCooldown(60);
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col items-center text-center gap-6 py-4">
      {/* Icon with pulsing glowing background */}
      <div className="relative flex items-center justify-center">
        {/* Glow effect */}
        <div 
          className="absolute inset-0 rounded-full blur-xl opacity-30 animate-pulse"
          style={{
            background: "radial-gradient(circle, #9cb080 0%, #2b5748 100%)",
          }}
        />
        {/* Outer Circle */}
        <div 
          className="relative w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(156,176,128,0.15) 0%, rgba(43,87,72,0.15) 100%)",
            border: "1px solid rgba(156,176,128,0.25)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          }}
        >
          <Mail className="w-8 h-8" style={{ color: "#9cb080" }} />
        </div>
      </div>

      {/* Typography */}
      <div className="flex flex-col gap-2">
        <h1 
          className="text-2xl font-semibold tracking-tight"
          style={{ color: "#e8ede6" }}
        >
          Check your email
        </h1>
        <p 
          className="text-sm px-2 leading-relaxed"
          style={{ color: "#8fa38f" }}
        >
          We sent a verification link to your email address. Please click the link to verify your account and activate Festo.
        </p>
      </div>

      {/* Displaying email with styling */}
      {email && (
        <div 
          className="px-3 py-1.5 rounded-full text-xs font-mono font-medium tracking-tight border border-[rgba(156,176,128,0.15)] max-w-full truncate"
          style={{
            background: "rgba(156,176,128,0.06)",
            color: "#9cb080",
          }}
          title={email}
        >
          {email}
        </div>
      )}

      {/* Divider */}
      <div 
        className="w-full h-px"
        style={{
          background: "linear-gradient(90deg, rgba(156,176,128,0) 0%, rgba(156,176,128,0.15) 50%, rgba(156,176,128,0) 100%)",
        }}
      />

      {/* Actions */}
      <div className="flex flex-col w-full gap-3">
        {email && (
          <button
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            className="flex items-center justify-center gap-2 text-sm font-medium transition-colors py-2.5 rounded-xl disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            style={{
              color: "#e8ede6",
              background: "linear-gradient(135deg, #2b5748 0%, #1e3d32 100%)",
              border: "1px solid rgba(156,176,128,0.2)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
            onMouseEnter={(e) => {
              if (cooldown === 0 && !resending) {
                e.currentTarget.style.filter = "brightness(1.1)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "none";
            }}
          >
            {resending ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : cooldown > 0 ? (
              `Resend Email (${cooldown}s)`
            ) : (
              "Resend Verification Link"
            )}
          </button>
        )}

        <Link
          href="/login"
          className="flex items-center justify-center gap-2 text-sm font-medium transition-colors py-2.5 rounded-xl border border-transparent"
          style={{
            color: "#8fa38f",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#e8ede6";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#8fa38f";
          }}
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
    <Suspense 
      fallback={
        <div className="flex items-center justify-center p-8">
          <RefreshCw className="w-6 h-6 animate-spin text-[#9cb080]" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}