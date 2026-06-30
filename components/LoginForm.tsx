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

      router.push("/dashboard");
    } catch (err: any) {
      setErrorText(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "#e8ede6" }}>
          Welcome Back
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "#618764" }}>
          Login to your account
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
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={setEmail}
        />

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#9cb080" }}>
              Password
            </label>
            <button
              type="button"
              className="text-xs transition-colors"
              style={{ color: "#618764" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#9cb080")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#618764")}
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
          <p className="text-xs font-semibold text-red-400 text-center mt-1">
            {errorText}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-1 w-full py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, #9cb080 0%, #618764 100%)",
            color: "#1a2820",
            boxShadow: "0 4px 18px rgba(97,135,100,0.28)",
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.08)";
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1)";
            }
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <Divider text="or continue with" />

      <div className="flex flex-col gap-2">
        <SocialBtn icon={<GoogleIcon />} label="Continue with Google" />
        <SocialBtn icon={<GithubIcon size={15} />} label="Continue with GitHub" />
      </div>

      <p className="text-center text-sm" style={{ color: "#618764" }}>
        {"Don't have an account?"}{" "}
        <Link
          href="/register"
          className="font-medium transition-colors"
          style={{ color: "#9cb080" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#c8d8b0")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#9cb080")}
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
