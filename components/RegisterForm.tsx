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

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCp, setShowCp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const router = useRouter();

  const onSubmit = async () => {
    setErrorText("");
    if (!name || !email || !password || !confirm) {
      setErrorText("All fields are required");
      return;
    }
    if (password !== confirm) {
      setErrorText("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await authClient.signUp.email({
        email: email,
        password: password,
        name: name,
      });

      if (error) {
        setErrorText(error.message || "Failed to create account");
        console.log(error.message);
        return;
      }

      router.push("/login");
    } catch (err: any) {
      setErrorText(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1
          className="text-2xl font-semibold tracking-tight"
          style={{ color: "#e8ede6" }}
        >
          Create your account
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "#618764" }}>
          {"Let's get you started with Festo."}
        </p>
      </div>

      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <Field
          label="Full Name"
          placeholder="Jane Doe"
          value={name}
          onChange={setName}
        />
        <Field
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={setEmail}
        />
        <Field
          label="Password"
          showToggle
          visible={showPw}
          onToggle={() => setShowPw((p) => !p)}
          placeholder="••••••••"
          value={password}
          onChange={setPassword}
        />
        <Field
          label="Confirm Password"
          showToggle
          visible={showCp}
          onToggle={() => setShowCp((p) => !p)}
          placeholder="••••••••"
          value={confirm}
          onChange={setConfirm}
        />

        <p className="text-xs leading-relaxed" style={{ color: "#618764" }}>
          I agree to the{" "}
          <button
            type="button"
            className="transition-colors"
            style={{ color: "#9cb080" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = "#c8d8b0")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = "#9cb080")
            }
          >
            Terms of Service
          </button>{" "}
          and{" "}
          <button
            type="button"
            className="transition-colors"
            style={{ color: "#9cb080" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = "#c8d8b0")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = "#9cb080")
            }
          >
            Privacy Policy
          </button>
        </p>

        {errorText && (
          <p className="text-xs font-semibold text-red-400 text-center mt-1">
            {errorText}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
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
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <Divider text="or continue with" />

      <div className="flex flex-col gap-2">
        <SocialBtn icon={<GoogleIcon />} label="Continue with Google" />
        <SocialBtn
          icon={<GithubIcon size={15} />}
          label="Continue with GitHub"
        />
      </div>

      <p className="text-center text-sm" style={{ color: "#618764" }}>
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium transition-colors"
          style={{ color: "#9cb080" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.color = "#c8d8b0")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.color = "#9cb080")
          }
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
