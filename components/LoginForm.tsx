"use client";

import { useState } from "react";
import Link from "next/link";
import Field from "./Field";
import SocialBtn from "./SocialBtn";
import GoogleIcon from "./GoogleIcon";
import Divider from "./Divider";
import GithubIcon from "./GithubIcon";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const router = useRouter();

  const onSubmit = async () => {
    setErrorText("");
    if (!email || !password) {
      setErrorText("All fields are required");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await authClient.signIn.email({
        email: email,
        password: password,
      });

      if (error) {
        setErrorText(error.message || "Failed to sign in");
        console.log(error.message);
        return;
      }

      router.push("/get-started");
    } catch (err: any) {
      setErrorText(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "#f9fafb" }}>
          Welcome back
        </h1>
        <p className="text-sm" style={{ color: "#9ca3af" }}>
          Sign in to your Festo account
        </p>
      </div>

      <form
        className="flex flex-col gap-3.5"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <Field
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={setEmail}
        />

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label
              className="text-xs font-medium uppercase tracking-widest"
              style={{ color: "#9ca3af" }}
            >
              Password
            </label>
            <button
              type="button"
              className="text-xs font-medium transition-colors"
              style={{ color: "#FF0000" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#ff4444")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#FF0000")
              }
            >
              Forgot password?
            </button>
          </div>
          <Field
            label=""
            showToggle
            visible={showPw}
            onToggle={() => setShowPw((p) => !p)}
            placeholder="••••••••"
            value={password}
            onChange={setPassword}
          />
        </div>

        {errorText && (
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium"
            style={{
              background: "rgba(149,1,1,0.12)",
              border: "1px solid rgba(255,0,0,0.2)",
              color: "#fca5a5",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 5v4M8 11h.01" stroke="#fca5a5" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="8" cy="8" r="7" stroke="#fca5a5" strokeWidth="1.5"/>
            </svg>
            {errorText}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-1 w-full py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, #FF0000 0%, #950101 100%)",
            color: "#fff",
            boxShadow: "0 4px 20px rgba(255,0,0,0.3), 0 1px 3px rgba(0,0,0,0.4)",
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.1)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 6px 24px rgba(255,0,0,0.45), 0 1px 3px rgba(0,0,0,0.4)";
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 4px 20px rgba(255,0,0,0.3), 0 1px 3px rgba(0,0,0,0.4)";
            }
          }}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <Divider text="or continue with" />

      <div className="flex flex-col gap-2">
        <SocialBtn icon={<GoogleIcon />} label="Continue with Google" />
        <SocialBtn icon={<GithubIcon size={15} />} label="Continue with GitHub" />
      </div>

      <p className="text-center text-sm" style={{ color: "#9ca3af" }}>
        {"Don't have an account?"}{" "}
        <Link
          href="/register"
          className="font-semibold transition-colors"
          style={{ color: "#FF0000" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.color = "#ff4444")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.color = "#FF0000")
          }
        >
          Create account
        </Link>
      </p>
    </div>
  );
}
