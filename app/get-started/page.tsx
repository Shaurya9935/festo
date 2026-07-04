"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, ArrowRight, ArrowLeft, User, Building, Info, RefreshCw, Sparkles } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { saveOnboardingData } from "@/services/onboarding.service";

// ── Palette ────────────────────────────────────────────────────────────────
// #4C3A51 deep-purple · #774360 plum · #B25068 rose · #E7AB79 amber

// ── Types ──────────────────────────────────────────────────────────────────
type OnboardingData = {
  fullName: string;
  phoneNumber: string;
  profileImageUrl: string;
  insName: string;
  userType: string;
  address: string;
  employees: string;
  eventNumber: "1-5" | "5-20" | "20-50" | "50+";
  participantNumber: "<50" | "50-100" | "100-250" | "250-500" | "500+";
};

const STEPS = [
  { id: "welcome",    label: "Welcome",      icon: <Sparkles size={11} /> },
  { id: "about",      label: "About You",    icon: <User size={11} /> },
  { id: "org",        label: "Organization", icon: <Building size={11} /> },
  { id: "additional", label: "Details",      icon: <Info size={11} /> },
  { id: "done",       label: "Done",         icon: <Check size={11} /> },
];

// ── OInput ─────────────────────────────────────────────────────────────────
function OInput({
  label, type = "text", placeholder, value, onChange, optional = false,
}: {
  label: string; type?: string; placeholder?: string;
  value: string; onChange: (v: string) => void; optional?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      <label className="text-xs font-semibold uppercase tracking-widest flex justify-between" style={{ color: "#774360" }}>
        <span>{label}</span>
        {optional && <span className="opacity-60 normal-case text-[10px] font-normal">Optional</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
        style={{
          background: "rgba(76,58,81,0.04)",
          border: "1px solid rgba(178,80,104,0.2)",
          color: "#4C3A51",
          boxShadow: "inset 0 1px 2px rgba(76,58,81,0.06)",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "rgba(178,80,104,0.55)";
          e.target.style.boxShadow = "0 0 0 3px rgba(178,80,104,0.1), inset 0 1px 2px rgba(76,58,81,0.06)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "rgba(178,80,104,0.2)";
          e.target.style.boxShadow = "inset 0 1px 2px rgba(76,58,81,0.06)";
        }}
      />
    </div>
  );
}

// ── OSelect ────────────────────────────────────────────────────────────────
function OSelect({
  label, options, value, onChange,
}: {
  label: string;
  options: string[] | { label: string; value: string }[];
  value: string;
  onChange: (v: any) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#774360" }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none appearance-none cursor-pointer transition-all"
        style={{
          background: `rgba(76,58,81,0.04) url("data:image/svg+xml;utf8,<svg fill='%239a8098' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>") no-repeat right 12px center`,
          border: "1px solid rgba(178,80,104,0.2)",
          color: value ? "#4C3A51" : "#9a8098",
          boxShadow: "inset 0 1px 2px rgba(76,58,81,0.06)",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "rgba(178,80,104,0.55)";
          e.target.style.boxShadow = "0 0 0 3px rgba(178,80,104,0.1), inset 0 1px 2px rgba(76,58,81,0.06)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "rgba(178,80,104,0.2)";
          e.target.style.boxShadow = "inset 0 1px 2px rgba(76,58,81,0.06)";
        }}
      >
        <option value="" disabled style={{ backgroundColor: "#fff", color: "#9a8098" }}>Select an option…</option>
        {options.map((opt) => {
          const val = typeof opt === "string" ? opt : opt.value;
          const lbl = typeof opt === "string" ? opt : opt.label;
          return (
            <option key={val} value={val} style={{ backgroundColor: "#fff", color: "#4C3A51" }}>
              {lbl}
            </option>
          );
        })}
      </select>
    </div>
  );
}

// ── Welcome Illustration ───────────────────────────────────────────────────
function WelcomeIllustration() {
  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(180deg, #fdf5fa 0%, #f4e6f0 100%)" }}
    >
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 80%, rgba(178,80,104,0.2) 0%, transparent 70%), radial-gradient(ellipse 55% 45% at 70% 30%, rgba(119,67,96,0.12) 0%, transparent 65%)",
      }} />
      <svg viewBox="0 0 280 340" className="relative z-10 w-3/4 max-w-[220px]" fill="none">
        <path d="M40 340 L40 140 Q40 40 140 40 Q240 40 240 140 L240 340Z" fill="rgba(178,80,104,0.15)" stroke="#B25068" strokeWidth="1.5" strokeOpacity="0.4" />
        <path d="M60 340 L60 148 Q60 68 140 68 Q220 68 220 148 L220 340Z" fill="rgba(255,255,255,0.7)" />
        <ellipse cx="140" cy="200" rx="55" ry="40" fill="#B25068" opacity="0.2" />
        <ellipse cx="110" cy="210" rx="30" ry="22" fill="#774360" opacity="0.18" />
        <ellipse cx="170" cy="215" rx="28" ry="20" fill="#B25068" opacity="0.15" />
        <ellipse cx="140" cy="310" rx="50" ry="12" fill="#774360" opacity="0.18" />
        <path d="M40 120 Q20 130 15 155 Q10 175 25 165 Q18 185 35 178 Q28 198 48 188" stroke="#B25068" strokeWidth="2" fill="none" strokeLinecap="round" strokeOpacity="0.5" />
        <ellipse cx="14" cy="160" rx="7" ry="5" fill="#E7AB79" opacity="0.5" transform="rotate(-20 14 160)" />
        <ellipse cx="23" cy="183" rx="7" ry="5" fill="#B25068" opacity="0.4" transform="rotate(10 23 183)" />
        <ellipse cx="40" cy="192" rx="8" ry="5" fill="#E7AB79" opacity="0.45" transform="rotate(30 40 192)" />
        <path d="M240 110 Q260 122 265 148 Q270 168 255 158 Q262 178 245 170 Q252 192 232 182" stroke="#B25068" strokeWidth="2" fill="none" strokeLinecap="round" strokeOpacity="0.5" />
        <ellipse cx="266" cy="153" rx="7" ry="5" fill="#774360" opacity="0.4" transform="rotate(20 266 153)" />
        <ellipse cx="257" cy="176" rx="7" ry="5" fill="#E7AB79" opacity="0.45" transform="rotate(-10 257 176)" />
        <ellipse cx="240" cy="186" rx="8" ry="5" fill="#B25068" opacity="0.4" transform="rotate(-30 240 186)" />
        <rect x="20" y="295" width="30" height="22" rx="4" fill="rgba(178,80,104,0.15)" />
        <path d="M35 295 Q25 270 20 255 Q30 265 35 260 Q40 265 50 255 Q45 270 35 295Z" fill="#B25068" opacity="0.4" />
        <ellipse cx="35" cy="252" rx="10" ry="8" fill="#E7AB79" opacity="0.5" />
        <rect x="230" y="295" width="30" height="22" rx="4" fill="rgba(178,80,104,0.15)" />
        <path d="M245 295 Q235 270 230 255 Q240 265 245 260 Q250 265 260 255 Q255 270 245 295Z" fill="#B25068" opacity="0.4" />
        <ellipse cx="245" cy="252" rx="10" ry="8" fill="#E7AB79" opacity="0.5" />
        {/* Sparkles */}
        <circle cx="80"  cy="80"  r="2.5" fill="#B25068" opacity="0.5" />
        <circle cx="200" cy="75"  r="2"   fill="#E7AB79" opacity="0.6" />
        <circle cx="65"  cy="170" r="1.5" fill="#774360" opacity="0.4" />
        <circle cx="215" cy="165" r="1.5" fill="#B25068" opacity="0.4" />
      </svg>
    </div>
  );
}

// ── StepWelcome ────────────────────────────────────────────────────────────
function StepWelcome({ onNext, animClass }: { onNext: () => void; animClass: string }) {
  return (
    <div className={`flex flex-col md:flex-row h-full min-h-[500px] ${animClass}`}>
      <div className="md:w-2/5 h-52 md:h-auto rounded-xl md:rounded-r-none rounded-b-none md:rounded-l-xl overflow-hidden flex-shrink-0">
        <WelcomeIllustration />
      </div>
      <div className="flex-1 flex flex-col justify-center p-8 md:p-10">
        <div className="max-w-sm">
          <h2 className="text-2xl font-bold mb-2 tracking-tight" style={{ color: "#4C3A51", fontFamily: "'Hanken Grotesk', sans-serif" }}>
            Welcome to Festo 🎉
          </h2>
          <p className="text-sm mb-6 leading-relaxed" style={{ color: "#9a8098" }}>
            {"We're excited to have you. Let's set up your account in a few quick steps."}
          </p>
          <ul className="flex flex-col gap-3 mb-8">
            {[
              ["Create & Manage Events",  "Build events of any size"],
              ["Streamline Check-In",     "Fast, contactless attendee check-in"],
              ["Analytics Dashboard",     "Real-time insights on your events"],
              ["Automated Emails",        "Confirmations & notifications"],
            ].map(([title, desc], idx) => (
              <li key={title} className="flex items-start gap-3">
                <div
                  className="mt-0.5 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                  style={{ background: "rgba(178,80,104,0.1)", border: "1px solid rgba(178,80,104,0.25)" }}
                >
                  <Check size={11} style={{ color: "#B25068" }} strokeWidth={3} />
                </div>
                <div className="text-left">
                  <span className="text-sm font-semibold block" style={{ color: "#4C3A51" }}>{title}</span>
                  <span className="text-xs block" style={{ color: "#9a8098" }}>{desc}</span>
                </div>
              </li>
            ))}
          </ul>
          <button
            type="button" onClick={onNext}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #B25068 0%, #774360 100%)",
              color: "#fff",
              boxShadow: "0 4px 20px rgba(178,80,104,0.3)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(1.08)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(178,80,104,0.45)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.filter = "brightness(1)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(178,80,104,0.3)"; }}
          >
            {"Let's Get Started"} <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── StepAbout ──────────────────────────────────────────────────────────────
function StepAbout({
  data, updateData, onNext, onBack, animClass,
}: {
  data: OnboardingData; updateData: (f: Partial<OnboardingData>) => void;
  onNext: () => void; onBack: () => void; animClass: string;
}) {
  const handleContinue = () => {
    if (!data.fullName.trim()) { toast.error("Please enter your full name."); return; }
    onNext();
  };
  return (
    <div className={`flex flex-col gap-6 max-w-lg mx-auto w-full ${animClass}`}>
      <div>
        <h2 className="text-xl font-bold tracking-tight" style={{ color: "#4C3A51", fontFamily: "'Hanken Grotesk', sans-serif" }}>About You</h2>
        <p className="text-sm mt-1" style={{ color: "#9a8098" }}>Tell us a little about yourself.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <OInput label="Full Name" placeholder="Jane Doe" value={data.fullName} onChange={(v) => updateData({ fullName: v })} />
        <OInput label="Phone Number" type="tel" placeholder="e.g. 9876543210" value={data.phoneNumber} onChange={(v) => updateData({ phoneNumber: v })} optional />
        <OInput label="Profile Image URL" placeholder="https://…" value={data.profileImageUrl} onChange={(v) => updateData({ profileImageUrl: v })} optional />
      </div>
      <NavRow onBack={onBack} onNext={handleContinue} />
    </div>
  );
}

// ── StepOrg ────────────────────────────────────────────────────────────────
function StepOrg({
  data, updateData, onNext, onBack, animClass,
}: {
  data: OnboardingData; updateData: (f: Partial<OnboardingData>) => void;
  onNext: () => void; onBack: () => void; animClass: string;
}) {
  const handleContinue = () => {
    if (!data.insName.trim()) { toast.error("Please enter your institution name."); return; }
    onNext();
  };
  return (
    <div className={`flex flex-col gap-6 max-w-lg mx-auto w-full ${animClass}`}>
      <div>
        <h2 className="text-xl font-bold tracking-tight" style={{ color: "#4C3A51", fontFamily: "'Hanken Grotesk', sans-serif" }}>Institution Details</h2>
        <p className="text-sm mt-1" style={{ color: "#9a8098" }}>Help us understand your Institution.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <OInput label="Institute Name" placeholder="Acme Corp" value={data.insName} onChange={(v) => updateData({ insName: v })} />
        <OSelect
          label="User Type"
          options={["event_organizer", "college_representative", "student", "club", "other"]}
          value={data.userType}
          onChange={(v) => updateData({ userType: v })}
        />
        <div className="sm:col-span-2">
          <OInput label="Institute Address" placeholder="123 Main St" value={data.address} onChange={(v) => updateData({ address: v })} optional />
        </div>
        <OSelect
          label="Team Size"
          options={["1–10", "11–50", "51–200", "201–500", "500+"]}
          value={data.employees}
          onChange={(v) => updateData({ employees: v })}
        />
      </div>
      <NavRow onBack={onBack} onNext={handleContinue} />
    </div>
  );
}

// ── StepAdditional ─────────────────────────────────────────────────────────
function StepAdditional({
  data, updateData, onSubmit, onBack, submitting, animClass,
}: {
  data: OnboardingData; updateData: (f: Partial<OnboardingData>) => void;
  onSubmit: () => void; onBack: () => void; submitting: boolean; animClass: string;
}) {
  return (
    <div className={`flex flex-col gap-6 max-w-lg mx-auto w-full ${animClass}`}>
      <div>
        <h2 className="text-xl font-bold tracking-tight" style={{ color: "#4C3A51", fontFamily: "'Hanken Grotesk', sans-serif" }}>A Few More Details</h2>
        <p className="text-sm mt-1" style={{ color: "#9a8098" }}>Almost done — just a little more info.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <OSelect
          label="Expected Events / Year"
          options={[
            { label: "1 to 5 events",       value: "1-5"  },
            { label: "5 to 20 events",       value: "5-20" },
            { label: "20 to 50 events",      value: "20-50"},
            { label: "More than 50 events",  value: "50+"  },
          ]}
          value={data.eventNumber}
          onChange={(v) => updateData({ eventNumber: v })}
        />
        <OSelect
          label="Attendees / Event"
          options={[
            { label: "Less than 50",  value: "<50"     },
            { label: "50 to 100",     value: "50-100"  },
            { label: "100 to 250",    value: "100-250" },
            { label: "250 to 500",    value: "250-500" },
            { label: "500+",          value: "500+"    },
          ]}
          value={data.participantNumber}
          onChange={(v) => updateData({ participantNumber: v })}
        />
      </div>
      <NavRow onBack={onBack} onNext={onSubmit} nextLabel={submitting ? "Saving…" : "Finish"} disabled={submitting} />
    </div>
  );
}

// ── StepDone ───────────────────────────────────────────────────────────────
function StepDone({ onGoToDashboard, animClass }: { onGoToDashboard: () => void; animClass: string }) {
  return (
    <div className={`flex flex-col items-center justify-center text-center gap-6 py-8 max-w-sm mx-auto ${animClass}`}>
      <div className="relative w-24 h-24">
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(178,80,104,0.2) 0%, transparent 70%)", animation: "pulseGlow 3s ease-in-out infinite" }}
        />
        <div
          className="absolute inset-2 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #fdf5fa, #f4e6f0)",
            border: "2px solid rgba(178,80,104,0.35)",
            boxShadow: "0 8px 32px rgba(178,80,104,0.18)",
            animation: "scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards",
          }}
        >
          <Check size={36} strokeWidth={2.5} style={{ color: "#B25068" }} />
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: "#4C3A51", fontFamily: "'Hanken Grotesk', sans-serif" }}>{"You're all set! 🎊"}</h2>
        <p className="text-sm mt-2 leading-relaxed" style={{ color: "#9a8098" }}>
          Your Festo account is ready. Start creating unforgettable events right away.
        </p>
      </div>
      <button
        onClick={onGoToDashboard}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] cursor-pointer"
        style={{
          background: "linear-gradient(135deg, #B25068 0%, #774360 100%)",
          color: "#fff",
          boxShadow: "0 4px 20px rgba(178,80,104,0.3)",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(1.08)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(178,80,104,0.45)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.filter = "brightness(1)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(178,80,104,0.3)"; }}
      >
        Go to Dashboard <ArrowRight size={15} />
      </button>
    </div>
  );
}

// ── NavRow ─────────────────────────────────────────────────────────────────
function NavRow({
  onBack, onNext, nextLabel = "Continue", disabled = false,
}: {
  onBack: () => void; onNext: () => void; nextLabel?: string; disabled?: boolean;
}) {
  return (
    <div className="flex justify-between items-center pt-2 w-full">
      <button
        type="button" onClick={onBack} disabled={disabled}
        className="flex items-center gap-1.5 text-sm font-medium px-4 py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ color: "#9a8098", border: "1px solid rgba(178,80,104,0.2)" }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.borderColor = "rgba(178,80,104,0.35)";
            e.currentTarget.style.color = "#4C3A51";
            e.currentTarget.style.background = "rgba(178,80,104,0.06)";
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            e.currentTarget.style.borderColor = "rgba(178,80,104,0.2)";
            e.currentTarget.style.color = "#9a8098";
            e.currentTarget.style.background = "transparent";
          }
        }}
      >
        <ArrowLeft size={14} /> Back
      </button>
      <button
        type="button" onClick={onNext} disabled={disabled}
        className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: "linear-gradient(135deg, #B25068 0%, #774360 100%)",
          color: "#fff",
          boxShadow: "0 4px 16px rgba(178,80,104,0.28)",
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.filter = "brightness(1.08)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(178,80,104,0.42)";
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            e.currentTarget.style.filter = "brightness(1)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(178,80,104,0.28)";
          }
        }}
      >
        {nextLabel} <ArrowRight size={14} />
      </button>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep]         = useState(0);
  const [dir, setDir]           = useState<"forward" | "backward">("forward");
  const [animKey, setAnimKey]   = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<OnboardingData>({
    fullName: "", phoneNumber: "", profileImageUrl: "",
    insName: "", userType: "", address: "", employees: "1–10",
    eventNumber: "1-5", participantNumber: "50-100",
  });

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || session.user.name || "",
      }));
    }
  }, [session]);

  const updateFormData = (fields: Partial<OnboardingData>) =>
    setFormData((prev) => ({ ...prev, ...fields }));

  const go = (target: number) => {
    setDir(target > step ? "forward" : "backward");
    setAnimKey((k) => k + 1);
    setStep(target);
  };
  const next = () => go(Math.min(step + 1, 4));
  const back = () => go(Math.max(step - 1, 0));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await saveOnboardingData({
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        profileImageUrl: formData.profileImageUrl,
        insName: formData.insName,
        eventNumber: formData.eventNumber,
        participantNumber: formData.participantNumber,
        featureType: "QR_Entry",
      });
      if (response.success) {
        toast.success("Details saved successfully!");
        next();
      } else {
        toast.error(response.error || "Failed to save details");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const animClass = dir === "forward" ? "anim-slide-forward" : "anim-slide-backward";

  if (isPending && step === 0) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center" style={{ background: "#fdf5fa" }}>
        <RefreshCw className="w-8 h-8 animate-spin" style={{ color: "#B25068" }} />
      </div>
    );
  }

  const progressPercent = (step / (STEPS.length - 1)) * 100;

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{
        background: "linear-gradient(135deg, #fdf5fa 0%, #f8f0f5 50%, #fdf5fa 100%)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Keyframes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@600;700&family=Inter:wght@400;500;600&display=swap');
        @keyframes slideForward  { from { opacity:0; transform:translateX(28px)  scale(0.98); } to { opacity:1; transform:translateX(0) scale(1); } }
        @keyframes slideBackward { from { opacity:0; transform:translateX(-28px) scale(0.98); } to { opacity:1; transform:translateX(0) scale(1); } }
        @keyframes pulseGlow { 0%,100% { transform:scale(1);    opacity:0.15; } 50% { transform:scale(1.1); opacity:0.3; } }
        @keyframes scaleIn   { from { transform:scale(0.8); opacity:0; } to { transform:scale(1); opacity:1; } }
        .anim-slide-forward  { animation: slideForward  0.38s cubic-bezier(0.16,1,0.3,1) forwards; }
        .anim-slide-backward { animation: slideBackward 0.38s cubic-bezier(0.16,1,0.3,1) forwards; }
      `}</style>

      {/* Subtle grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(76,58,81,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(76,58,81,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Header */}
      <header
        className="relative z-10 flex items-center justify-between px-6 md:px-10 py-4"
        style={{ borderBottom: "1px solid rgba(178,80,104,0.12)", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #B25068 0%, #774360 100%)", boxShadow: "0 2px 12px rgba(178,80,104,0.3)" }}
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M2 7L5.5 10.5L12 3.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-base font-semibold tracking-tight" style={{ color: "#4C3A51", fontFamily: "'Hanken Grotesk', sans-serif" }}>Festo</span>
        </div>

        {/* Step pills — desktop */}
        <div className="hidden sm:flex items-center gap-1">
          {STEPS.map((s, i) => {
            const done   = step > i;
            const active = step === i;
            return (
              <div key={s.id} className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => { if (done) go(i); }}
                  disabled={!done}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: active ? "rgba(178,80,104,0.1)" : done ? "rgba(178,80,104,0.06)" : "rgba(76,58,81,0.04)",
                    border: `1px solid ${active ? "rgba(178,80,104,0.45)" : done ? "rgba(178,80,104,0.2)" : "rgba(76,58,81,0.1)"}`,
                    color:  active ? "#B25068" : done ? "#774360" : "#9a8098",
                    cursor: done ? "pointer" : "default",
                  }}
                >
                  {done ? <Check size={11} strokeWidth={3} /> : s.icon}
                  <span>{s.label}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div
                    className="w-5 h-px transition-all duration-500"
                    style={{ background: done ? "rgba(178,80,104,0.3)" : "rgba(76,58,81,0.1)" }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile dots */}
        <div className="flex sm:hidden items-center gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === step ? "20px" : "8px",
                height: "8px",
                background: i === step ? "#B25068" : i < step ? "#774360" : "rgba(76,58,81,0.15)",
              }}
            />
          ))}
        </div>
      </header>

      {/* Progress bar */}
      <div className="relative z-10 h-0.5 w-full" style={{ background: "rgba(178,80,104,0.12)" }}>
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${progressPercent}%`,
            background: "linear-gradient(90deg, #B25068, #E7AB79)",
            boxShadow: "0 0 8px rgba(178,80,104,0.4)",
          }}
        />
      </div>

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-start md:items-center justify-center p-6 md:p-10">
        <div
          className="w-full max-w-2xl rounded-2xl overflow-hidden relative"
          style={{
            background: "#ffffff",
            border: "1px solid rgba(178,80,104,0.15)",
            boxShadow: "0 0 0 1px rgba(76,58,81,0.03), 0 32px 64px rgba(76,58,81,0.1), 0 8px 24px rgba(178,80,104,0.06)",
          }}
        >
          {/* Top accent */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(178,80,104,0.55) 40%, rgba(231,171,121,0.5) 60%, transparent 100%)",
            }}
          />
          {/* Ambient glow corners */}
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl pointer-events-none"
            style={{ background: "rgba(178,80,104,0.06)", animation: "pulseGlow 6s ease-in-out infinite" }} />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full blur-3xl pointer-events-none"
            style={{ background: "rgba(119,67,96,0.06)", animation: "pulseGlow 8s ease-in-out infinite 2s" }} />

          <div className="p-6 md:p-8" key={animKey}>
            {step === 0 && <StepWelcome onNext={next} animClass={animClass} />}
            {step === 1 && <StepAbout data={formData} updateData={updateFormData} onNext={next} onBack={back} animClass={animClass} />}
            {step === 2 && <StepOrg data={formData} updateData={updateFormData} onNext={next} onBack={back} animClass={animClass} />}
            {step === 3 && <StepAdditional data={formData} updateData={updateFormData} onSubmit={handleSubmit} onBack={back} submitting={submitting} animClass={animClass} />}
            {step === 4 && <StepDone onGoToDashboard={() => router.push("/dashboard")} animClass={animClass} />}
          </div>
        </div>
      </main>
    </div>
  );
}