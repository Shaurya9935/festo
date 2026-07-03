"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Mail, Lock, Sparkles } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import GoogleIcon from "./GoogleIcon";
import GithubIcon from "./GithubIcon";

// ── Palette ────────────────────────────────────────────────────────────────
// #4C3A51 deep purple · #774360 plum · #B25068 rose · #E7AB79 amber

// ── WebGL Shader Canvas ────────────────────────────────────────────────────
function ShaderCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function syncSize() {
      if (!canvas) return;
      const w = canvas.clientWidth || 800;
      const h = canvas.clientHeight || 600;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    const ro = new ResizeObserver(syncSize);
    ro.observe(canvas);
    syncSize();

    const gl = (
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    ) as WebGLRenderingContext | null;
    if (!gl) return;

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

    const fs = `precision highp float;
varying vec2 v_texCoord;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
  + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
    vec2 uv = v_texCoord;
    vec2 m = u_mouse / u_resolution;
    float n = snoise(uv * 2.0 + u_time * 0.1);
    n += 0.5  * snoise(uv * 4.0 - u_time * 0.15);
    n += 0.25 * snoise(uv * 8.0 + u_time * 0.2);
    float dist = length(uv - m);
    n += (1.0 - smoothstep(0.0, 0.5, dist)) * 0.3;

    // Ametrine palette: #4C3A51 · #774360 · #B25068 · #E7AB79
    vec3 c1 = vec3(0.298, 0.227, 0.318);
    vec3 c2 = vec3(0.467, 0.263, 0.376);
    vec3 c3 = vec3(0.698, 0.314, 0.408);
    vec3 c4 = vec3(0.906, 0.671, 0.475);

    vec3 col = mix(c1, c2, n * 0.5 + 0.5);
    col = mix(col, c3, smoothstep(0.2, 0.8, n));
    col = mix(col, c4, smoothstep(0.6, 1.0, n) * 0.45);

    float vignette = 1.0 - length(uv - 0.5) * 0.7;
    gl_FragColor = vec4(col * vignette, 1.0);
}`;

    function cs(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, cs(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, cs(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    const uTime  = gl.getUniformLocation(prog, "u_time");
    const uRes   = gl.getUniformLocation(prog, "u_resolution");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    const onMM = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      if (r.width && r.height) {
        mouse.x = ((e.clientX - r.left) / r.width) * canvas.width;
        mouse.y = (1 - (e.clientY - r.top) / r.height) * canvas.height;
      }
    };
    window.addEventListener("mousemove", onMM);
    let raf: number;
    function render(t: number) {
      syncSize();
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
      if (uTime)  gl!.uniform1f(uTime, t * 0.001);
      if (uRes)   gl!.uniform2f(uRes, canvas!.width, canvas!.height);
      if (uMouse) gl!.uniform2f(uMouse, mouse.x, mouse.y);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(render);
    }
    raf = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMM);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />;
}

// ── Shared Social Button ───────────────────────────────────────────────────
function SocialPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl text-sm font-medium transition-all active:scale-[0.98]"
      style={{
        background: "rgba(76,58,81,0.05)",
        border: "1px solid rgba(178,80,104,0.22)",
        color: "#4C3A51",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(178,80,104,0.09)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(178,80,104,0.4)";
        (e.currentTarget as HTMLButtonElement).style.color = "#774360";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(76,58,81,0.05)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(178,80,104,0.22)";
        (e.currentTarget as HTMLButtonElement).style.color = "#4C3A51";
      }}
    >
      {icon}
      {label}
    </button>
  );
}

// ── Login Form ─────────────────────────────────────────────────────────────
export default function LoginForm() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [errorText, setErrorText] = useState("");
  const router = useRouter();

  const onSubmit = async () => {
    setErrorText("");
    if (!email || !password) { setErrorText("All fields are required"); return; }
    setLoading(true);
    try {
      const { error } = await authClient.signIn.email({ email, password });
      if (error) { setErrorText(error.message || "Failed to sign in"); return; }
      router.push("/get-started");
    } catch (err: any) {
      setErrorText(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@600;700&family=Inter:wght@400;500;600&display=swap');
        .lf-fade { opacity:0; transform:translateY(18px); animation:lfUp 0.55s cubic-bezier(0.16,1,0.3,1) forwards; }
        @keyframes lfUp { to { opacity:1; transform:translateY(0); } }
        .lf-s1{animation-delay:.07s} .lf-s2{animation-delay:.16s}
        .lf-s3{animation-delay:.25s} .lf-s4{animation-delay:.34s} .lf-s5{animation-delay:.43s}
        .lf-inp-wrap { transition: box-shadow 0.22s, border-color 0.22s; }
        .lf-inp-wrap:focus-within {
          border-color: rgba(178,80,104,0.6) !important;
          box-shadow: 0 0 0 4px rgba(178,80,104,0.12);
        }
        .glass-card {
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }
      `}</style>

      <div
        className="min-h-screen w-full flex flex-col md:flex-row md:h-screen overflow-hidden"
        style={{ fontFamily: "'Inter', sans-serif", background: "#faf5f8" }}
      >
        {/* ── Visual Column — right on desktop, top on mobile ────────── */}
        <div
          className="w-full md:w-[55%] h-[260px] md:h-full relative overflow-hidden flex-shrink-0 order-1 md:order-2"
        >
          <div className="absolute inset-0">
            <ShaderCanvas />
          </div>

          {/* Glassmorphic tagline — desktop only */}
          <div className="absolute inset-0 hidden md:flex items-center justify-center p-10">
            <div
              className="glass-card rounded-2xl p-10 max-w-md text-center shadow-2xl border transition-transform duration-700 hover:scale-[1.02]"
              style={{
                background: "rgba(255,255,255,0.18)",
                borderColor: "rgba(255,255,255,0.35)",
              }}
            >
              <div className="flex items-center justify-center gap-2 mb-5">
                <Sparkles size={18} style={{ color: "#E7AB79" }} />
                <span
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "rgba(255,255,255,0.75)" }}
                >
                  Festo Events
                </span>
              </div>
              <h2
                className="text-4xl font-bold mb-4 drop-shadow-md"
                style={{
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  color: "#ffffff",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                Elevate Your Events.
              </h2>
              <p className="text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
                Seamlessly manage, experience, and flow through your next gathering with precision and style.
              </p>
            </div>
          </div>
        </div>

        {/* ── Form Column — left on desktop, bottom on mobile ─────────── */}
        <main
          className="w-full md:w-[45%] flex flex-col justify-center relative order-2 md:order-1 overflow-y-auto"
          style={{ background: "#ffffff", minHeight: "calc(100vh - 260px)" }}
        >
          {/* Subtle top-edge accent */}
          <div
            className="absolute top-0 left-0 right-0 h-0.5"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(178,80,104,0.4) 40%, rgba(231,171,121,0.35) 60%, transparent 100%)",
            }}
          />

          {/* Subtle grid — relative so it stays inside this column */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(76,58,81,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(76,58,81,0.03) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Right separator on desktop */}
          <div
            className="hidden md:block absolute top-0 right-0 w-px h-full"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(178,80,104,0.2) 30%, rgba(119,67,96,0.15) 70%, transparent 100%)",
            }}
          />

          <div className="relative z-10 w-full max-w-[420px] mx-auto px-6 md:px-0 py-12 md:py-0">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-10 lf-fade lf-s1">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #B25068 0%, #774360 100%)",
                  boxShadow: "0 2px 14px rgba(178,80,104,0.35)",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7L5.5 10.5L12 3.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span
                className="text-lg font-bold tracking-tight"
                style={{ color: "#4C3A51", fontFamily: "'Hanken Grotesk', sans-serif" }}
              >
                Festo
              </span>
            </div>

            {/* Heading */}
            <div className="mb-8 lf-fade lf-s2">
              <h1
                className="text-3xl font-bold tracking-tight mb-1.5"
                style={{
                  color: "#4C3A51",
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  letterSpacing: "-0.02em",
                }}
              >
                Welcome back
              </h1>
              <p className="text-sm" style={{ color: "#9a8098" }}>
                Sign in to continue to Festo.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="flex flex-col gap-5">
              {/* Email */}
              <div className="flex flex-col gap-1.5 lf-fade lf-s3">
                <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#774360" }}>
                  Email
                </label>
                <div
                  className="lf-inp-wrap relative flex items-center rounded-xl border"
                  style={{ background: "rgba(76,58,81,0.04)", borderColor: "rgba(178,80,104,0.2)" }}
                >
                  <Mail size={15} className="absolute left-3.5" style={{ color: "#9a8098" }} />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-transparent text-sm outline-none"
                    style={{ color: "#4C3A51" }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5 lf-fade lf-s3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#774360" }}>
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs font-medium transition-colors"
                    style={{ color: "#B25068" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#774360")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#B25068")}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div
                  className="lf-inp-wrap relative flex items-center rounded-xl border"
                  style={{ background: "rgba(76,58,81,0.04)", borderColor: "rgba(178,80,104,0.2)" }}
                >
                  <Lock size={15} className="absolute left-3.5" style={{ color: "#9a8098" }} />
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-3 bg-transparent text-sm outline-none"
                    style={{ color: "#4C3A51" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((p) => !p)}
                    className="absolute right-3.5 transition-colors"
                    style={{ color: "#9a8098" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#4C3A51")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#9a8098")}
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {errorText && (
                <div
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium"
                  style={{
                    background: "rgba(178,80,104,0.08)",
                    border: "1px solid rgba(178,80,104,0.25)",
                    color: "#774360",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M8 5v4M8 11h.01" stroke="#B25068" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="8" cy="8" r="7" stroke="#B25068" strokeWidth="1.5"/>
                  </svg>
                  {errorText}
                </div>
              )}

              {/* Actions */}
              <div className="lf-fade lf-s4 flex flex-col gap-3 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg, #B25068 0%, #774360 100%)",
                    color: "#ffffff",
                    boxShadow: "0 4px 20px rgba(178,80,104,0.35), 0 1px 3px rgba(76,58,81,0.2)",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.08)";
                      (e.currentTarget as HTMLButtonElement).style.boxShadow =
                        "0 6px 24px rgba(178,80,104,0.5), 0 1px 3px rgba(76,58,81,0.2)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1)";
                      (e.currentTarget as HTMLButtonElement).style.boxShadow =
                        "0 4px 20px rgba(178,80,104,0.35), 0 1px 3px rgba(76,58,81,0.2)";
                    }
                  }}
                >
                  {loading ? "Signing in…" : "Login"}
                  {!loading && <ArrowRight size={16} />}
                </button>

                {/* Divider */}
                <div className="relative flex items-center py-1">
                  <div className="flex-grow h-px" style={{ background: "rgba(178,80,104,0.18)" }} />
                  <span className="flex-shrink-0 mx-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "#9a8098" }}>or</span>
                  <div className="flex-grow h-px" style={{ background: "rgba(178,80,104,0.18)" }} />
                </div>

                <SocialPill icon={<GoogleIcon />}         label="Sign in with Google" />
                <SocialPill icon={<GithubIcon size={15} />} label="Sign in with GitHub" />
              </div>
            </form>

            {/* Register link */}
            <p className="text-center text-sm mt-8 lf-fade lf-s5" style={{ color: "#9a8098" }}>
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold transition-colors"
                style={{ color: "#B25068" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#774360")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#B25068")}
              >
                Register
              </Link>
            </p>
          </div>

          {/* Footer */}
          <footer
            className="relative z-10 w-full flex justify-center md:justify-start py-4 px-6 md:px-10 mt-8"
            style={{ borderTop: "1px solid rgba(178,80,104,0.1)" }}
          >
            <span className="text-xs" style={{ color: "#9a8098" }}>
              © {new Date().getFullYear()} Festo Inc. All rights reserved.
            </span>
          </footer>
        </main>
      </div>
    </>
  );
}
