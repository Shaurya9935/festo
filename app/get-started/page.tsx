"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Check, ArrowRight, ArrowLeft, User, Building, Info, RefreshCw, Sparkles } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { saveOnboardingData } from "@/services/onboarding";

// ── Types ──────────────────────────────────────────────────────────────────
type OnboardingData = {
  fullName: string;
  email: string;
  country: string;
  phoneNumber: string;
  orgName: string;
  orgType: string;
  address: string;
  employees: string;
  city: string;
  zip: string;
  state: string;
  eventNumber: "1-5" | "5-20" | "20-50" | "50+";
  participantNumber: "<50" | "50-100" | "100-250" | "250-500" | "500+";
  featureType: "QR_Entry" | "Registration" | "Attendance" | "Complete_Event_Management";
};

const STEPS = [
  { id: "welcome", label: "Welcome", icon: <Sparkles size={11} /> },
  { id: "about", label: "About You", icon: <User size={11} /> },
  { id: "org", label: "Organization", icon: <Building size={11} /> },
  { id: "additional", label: "Details", icon: <Info size={11} /> },
  { id: "done", label: "Done", icon: <Check size={11} /> },
];

// ── Input component (new design system) ───────────────────────────────────
function OInput({
  label, type = "text", placeholder, value, onChange, optional = false,
}: {
  label: string; type?: string; placeholder?: string;
  value: string; onChange: (v: string) => void; optional?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      <label className="text-xs font-medium uppercase tracking-widest flex justify-between" style={{ color: "#6b7280" }}>
        <span>{label}</span>
        {optional && <span className="opacity-60 normal-case text-[10px]">Optional</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.09)",
          color: "#f9fafb",
          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3)",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "rgba(52,211,153,0.45)";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(52,211,153,0.08), inset 0 1px 2px rgba(0,0,0,0.3)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
          e.currentTarget.style.boxShadow = "inset 0 1px 2px rgba(0,0,0,0.3)";
        }}
      />
    </div>
  );
}

// ── Select component (new design system) ──────────────────────────────────
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
      <label className="text-xs font-medium uppercase tracking-widest" style={{ color: "#6b7280" }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none appearance-none cursor-pointer transition-all"
        style={{
          background: `rgba(255,255,255,0.04) url("data:image/svg+xml;utf8,<svg fill='%236b7280' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>") no-repeat right 12px center`,
          border: "1px solid rgba(255,255,255,0.09)",
          color: value ? "#f9fafb" : "#6b7280",
          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3)",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "rgba(52,211,153,0.45)";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(52,211,153,0.08), inset 0 1px 2px rgba(0,0,0,0.3)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
          e.currentTarget.style.boxShadow = "inset 0 1px 2px rgba(0,0,0,0.3)";
        }}
      >
        <option value="" disabled style={{ backgroundColor: "#0d1117", color: "#6b7280" }}>Select an option…</option>
        {options.map((opt) => {
          const val = typeof opt === "string" ? opt : opt.value;
          const lbl = typeof opt === "string" ? opt : opt.label;
          return (
            <option key={val} value={val} style={{ backgroundColor: "#0d1117", color: "#f9fafb" }}>
              {lbl}
            </option>
          );
        })}
      </select>
    </div>
  );
}

// ── Welcome illustration (updated colors) ─────────────────────────────────
function WelcomeIllustration() {
  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(180deg, #071014 0%, #0a1a14 100%)" }}
    >
      {/* Background glow */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 80%, rgba(5,150,105,0.35) 0%, transparent 70%), radial-gradient(ellipse 55% 45% at 70% 30%, rgba(99,102,241,0.15) 0%, transparent 65%)",
      }} />
      <svg viewBox="0 0 280 340" className="relative z-10 w-3/4 max-w-[220px]" fill="none">
        <path d="M40 340 L40 140 Q40 40 140 40 Q240 40 240 140 L240 340Z" fill="#064e3b" stroke="#34d399" strokeWidth="1.5" strokeOpacity="0.5" />
        <path d="M60 340 L60 148 Q60 68 140 68 Q220 68 220 148 L220 340Z" fill="#030d09" />
        <ellipse cx="140" cy="200" rx="55" ry="40" fill="#065f46" opacity="0.6" />
        <ellipse cx="110" cy="210" rx="30" ry="22" fill="#047857" opacity="0.5" />
        <ellipse cx="170" cy="215" rx="28" ry="20" fill="#059669" opacity="0.4" />
        <ellipse cx="140" cy="310" rx="50" ry="12" fill="#064e3b" opacity="0.7" />
        <path d="M40 120 Q20 130 15 155 Q10 175 25 165 Q18 185 35 178 Q28 198 48 188" stroke="#34d399" strokeWidth="2" fill="none" strokeLinecap="round" strokeOpacity="0.7" />
        <ellipse cx="14" cy="160" rx="7" ry="5" fill="#34d399" opacity="0.5" transform="rotate(-20 14 160)" />
        <ellipse cx="23" cy="183" rx="7" ry="5" fill="#6ee7b7" opacity="0.5" transform="rotate(10 23 183)" />
        <ellipse cx="40" cy="192" rx="8" ry="5" fill="#34d399" opacity="0.5" transform="rotate(30 40 192)" />
        <path d="M240 110 Q260 122 265 148 Q270 168 255 158 Q262 178 245 170 Q252 192 232 182" stroke="#34d399" strokeWidth="2" fill="none" strokeLinecap="round" strokeOpacity="0.7" />
        <ellipse cx="266" cy="153" rx="7" ry="5" fill="#6ee7b7" opacity="0.5" transform="rotate(20 266 153)" />
        <ellipse cx="257" cy="176" rx="7" ry="5" fill="#34d399" opacity="0.5" transform="rotate(-10 257 176)" />
        <ellipse cx="240" cy="186" rx="8" ry="5" fill="#6ee7b7" opacity="0.5" transform="rotate(-30 240 186)" />
        <rect x="20" y="295" width="30" height="22" rx="4" fill="#064e3b" />
        <path d="M35 295 Q25 270 20 255 Q30 265 35 260 Q40 265 50 255 Q45 270 35 295Z" fill="#059669" opacity="0.8" />
        <ellipse cx="35" cy="252" rx="10" ry="8" fill="#34d399" opacity="0.6" />
        <rect x="230" y="295" width="30" height="22" rx="4" fill="#064e3b" />
        <path d="M245 295 Q235 270 230 255 Q240 265 245 260 Q250 265 260 255 Q255 270 245 295Z" fill="#059669" opacity="0.8" />
        <ellipse cx="245" cy="252" rx="10" ry="8" fill="#34d399" opacity="0.6" />
        {/* Indigo sparkles for contrast */}
        <circle cx="80" cy="80" r="2.5" fill="#818cf8" opacity="0.7" />
        <circle cx="200" cy="75" r="2" fill="#c7d2fe" opacity="0.6" />
        <circle cx="65" cy="170" r="1.5" fill="#34d399" opacity="0.6" />
        <circle cx="215" cy="165" r="1.5" fill="#6ee7b7" opacity="0.6" />
      </svg>
    </div>
  );
}

// ── Step: Welcome ──────────────────────────────────────────────────────────
function StepWelcome({ onNext, animClass }: { onNext: () => void; animClass: string }) {
  return (
    <div className={`flex flex-col md:flex-row h-full min-h-[500px] ${animClass}`}>
      <div className="md:w-2/5 h-52 md:h-auto rounded-xl md:rounded-r-none rounded-b-none md:rounded-l-xl overflow-hidden flex-shrink-0">
        <WelcomeIllustration />
      </div>
      <div className="flex-1 flex flex-col justify-center p-8 md:p-10">
        <div className="max-w-sm">
          <h2 className="text-2xl font-bold mb-2 tracking-tight" style={{ color: "#f9fafb" }}>
            Welcome to Festo 🎉
          </h2>
          <p className="text-sm mb-6 leading-relaxed" style={{ color: "#9ca3af" }}>
            {"We're excited to have you. Let's set up your account in a few quick steps."}
          </p>
          <ul className="flex flex-col gap-3 mb-8">
            {[
              ["Create & Manage Events", "Build events of any size"],
              ["Streamline Check-In",   "Fast, contactless attendee check-in"],
              ["Analytics Dashboard",  "Real-time insights on your events"],
              ["Automated Emails",     "Confirmations & notifications"],
            ].map(([title, desc], idx) => (
              <li key={title} className="flex items-start gap-3" style={{ animationDelay: `${idx * 60}ms` }}>
                <div
                  className="mt-0.5 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                  style={{
                    background: "rgba(52,211,153,0.12)",
                    border: "1px solid rgba(52,211,153,0.3)",
                  }}
                >
                  <Check size={11} style={{ color: "#34d399" }} strokeWidth={3} />
                </div>
                <div className="text-left">
                  <span className="text-sm font-semibold block" style={{ color: "#f9fafb" }}>{title}</span>
                  <span className="text-xs block" style={{ color: "#6b7280" }}>{desc}</span>
                </div>
              </li>
            ))}
          </ul>
          <button
            type="button" onClick={onNext}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #34d399 0%, #059669 100%)",
              color: "#022c22",
              boxShadow: "0 4px 20px rgba(52,211,153,0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = "brightness(1.08)";
              e.currentTarget.style.boxShadow = "0 6px 24px rgba(52,211,153,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "brightness(1)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(52,211,153,0.3)";
            }}
          >
            {"Let's Get Started"} <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Step: About You ────────────────────────────────────────────────────────
function StepAbout({
  data, updateData, onNext, onBack, animClass,
}: {
  data: OnboardingData; updateData: (f: Partial<OnboardingData>) => void;
  onNext: () => void; onBack: () => void; animClass: string;
}) {
  const handleContinue = () => {
    if (!data.fullName.trim()) { toast.error("Please enter your full name."); return; }
    if (!data.email.trim()) { toast.error("Please enter your email."); return; }
    onNext();
  };
  return (
    <div className={`flex flex-col gap-6 max-w-lg mx-auto w-full ${animClass}`}>
      <div>
        <h2 className="text-xl font-bold tracking-tight" style={{ color: "#f9fafb" }}>About You</h2>
        <p className="text-sm mt-1" style={{ color: "#6b7280" }}>Tell us a little about yourself.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <OInput label="Full Name" placeholder="Jane Doe" value={data.fullName} onChange={(v) => updateData({ fullName: v })} />
        <OInput label="Email" type="email" placeholder="you@example.com" value={data.email} onChange={(v) => updateData({ email: v })} />
        <OSelect
          label="Country"
          options={["India", "United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Other"]}
          value={data.country}
          onChange={(v) => updateData({ country: v })}
        />
        <OInput label="Phone Number" type="tel" placeholder="e.g. 9876543210" value={data.phoneNumber} onChange={(v) => updateData({ phoneNumber: v })} optional />
      </div>
      <NavRow onBack={onBack} onNext={handleContinue} />
    </div>
  );
}

// ── Step: Institution────────────────────────────────────────────────────
function StepOrg({
  data, updateData, onNext, onBack, animClass,
}: {
  data: OnboardingData; updateData: (f: Partial<OnboardingData>) => void;
  onNext: () => void; onBack: () => void; animClass: string;
}) {
  const handleContinue = () => {
    if (!data.orgName.trim()) { toast.error("Please enter your instituion name."); return; }
    onNext();
  };
  return (
    <div className={`flex flex-col gap-6 max-w-lg mx-auto w-full ${animClass}`}>
      <div>
        <h2 className="text-xl font-bold tracking-tight" style={{ color: "#f9fafb" }}>Institution Details</h2>
        <p className="text-sm mt-1" style={{ color: "#6b7280" }}>Help us understand your Institution.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <OInput label="Institute Name" placeholder="Acme Corp" value={data.orgName} onChange={(v) => updateData({ orgName: v })} />
        {/* <OSelect
          label="Organization Type"
          options={["Startup", "SMB", "Enterprise", "Non-profit", "Government", "Education"]}
          value={data.orgType}
          onChange={(v) => updateData({ orgType: v })}
        /> */}
        <div className="sm:col-span-2">
          <OInput label="Institute Address" placeholder="123 Main St" value={data.address} onChange={(v) => updateData({ address: v })} optional />
        </div>
        <OSelect
          label="Team Size"
          options={["1–10", "11–50", "51–200", "201–500", "500+"]}
          value={data.employees}
          onChange={(v) => updateData({ employees: v })}
        />
        <OInput label="City" placeholder="New Delhi" value={data.city} onChange={(v) => updateData({ city: v })} optional />
        <OInput label="Zip Code" placeholder="110001" value={data.zip} onChange={(v) => updateData({ zip: v })} optional />
        <div className="sm:col-span-2">
          <OInput label="State / Province" placeholder="Delhi" value={data.state} onChange={(v) => updateData({ state: v })} optional />
        </div>
      </div>
      <NavRow onBack={onBack} onNext={handleContinue} />
    </div>
  );
}

// ── Step: Additional Info ──────────────────────────────────────────────────
function StepAdditional({
  data, updateData, onSubmit, onBack, submitting, animClass,
}: {
  data: OnboardingData; updateData: (f: Partial<OnboardingData>) => void;
  onSubmit: () => void; onBack: () => void; submitting: boolean; animClass: string;
}) {
  return (
    <div className={`flex flex-col gap-6 max-w-lg mx-auto w-full ${animClass}`}>
      <div>
        <h2 className="text-xl font-bold tracking-tight" style={{ color: "#f9fafb" }}>A Few More Details</h2>
        <p className="text-sm mt-1" style={{ color: "#6b7280" }}>Almost done — just a little more info.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <OSelect
          label="Expected Events / Year"
          options={[
            { label: "1 to 5 events", value: "1-5" },
            { label: "5 to 20 events", value: "5-20" },
            { label: "20 to 50 events", value: "20-50" },
            { label: "More than 50 events", value: "50+" },
          ]}
          value={data.eventNumber}
          onChange={(v) => updateData({ eventNumber: v })}
        />
        <OSelect
          label="Attendees / Event"
          options={[
            { label: "Less than 50", value: "<50" },
            { label: "50 to 100", value: "50-100" },
            { label: "100 to 250", value: "100-250" },
            { label: "250 to 500", value: "250-500" },
            { label: "500+", value: "500+" },
          ]}
          value={data.participantNumber}
          onChange={(v) => updateData({ participantNumber: v })}
        />
        <div className="sm:col-span-2">
          <OSelect
            label="Primary Feature Needed"
            options={[
              { label: "Fast QR-based Event Entry", value: "QR_Entry" },
              { label: "Online Attendee Registration", value: "Registration" },
              { label: "Attendance Tracking & Reports", value: "Attendance" },
              { label: "All-in-One Complete Event Management", value: "Complete_Event_Management" },
            ]}
            value={data.featureType}
            onChange={(v) => updateData({ featureType: v })}
          />
        </div>
      </div>
      <NavRow onBack={onBack} onNext={onSubmit} nextLabel={submitting ? "Saving…" : "Finish"} disabled={submitting} />
    </div>
  );
}

// ── Step: Done ─────────────────────────────────────────────────────────────
function StepDone({ onGoToDashboard, animClass }: { onGoToDashboard: () => void; animClass: string }) {
  return (
    <div className={`flex flex-col items-center justify-center text-center gap-6 py-8 max-w-sm mx-auto ${animClass}`}>
      <div className="relative w-24 h-24">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(52,211,153,0.25) 0%, transparent 70%)",
            animation: "pulseGlow 3s ease-in-out infinite",
          }}
        />
        <div
          className="absolute inset-2 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #064e3b, #022c22)",
            border: "2px solid rgba(52,211,153,0.4)",
            boxShadow: "0 8px 32px rgba(52,211,153,0.2)",
            animation: "scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards",
          }}
        >
          <Check size={36} strokeWidth={2.5} style={{ color: "#34d399" }} />
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: "#f9fafb" }}>{"You're all set! 🎊"}</h2>
        <p className="text-sm mt-2 leading-relaxed" style={{ color: "#9ca3af" }}>
          Your Festo account is ready. Start creating unforgettable events right away.
        </p>
      </div>
      <button
        onClick={onGoToDashboard}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] cursor-pointer"
        style={{
          background: "linear-gradient(135deg, #34d399 0%, #059669 100%)",
          color: "#022c22",
          boxShadow: "0 4px 20px rgba(52,211,153,0.3)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.filter = "brightness(1.08)";
          e.currentTarget.style.boxShadow = "0 6px 24px rgba(52,211,153,0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.filter = "brightness(1)";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(52,211,153,0.3)";
        }}
      >
        Go to Dashboard <ArrowRight size={15} />
      </button>
    </div>
  );
}

// ── Nav row ────────────────────────────────────────────────────────────────
function NavRow({
  onBack, onNext, nextLabel = "Continue", disabled = false,
}: {
  onBack: () => void; onNext: () => void; nextLabel?: string; disabled?: boolean;
}) {
  return (
    <div className="flex justify-between items-center pt-2 w-full">
      <button
        type="button"
        onClick={onBack}
        disabled={disabled}
        className="flex items-center gap-1.5 text-sm font-medium px-4 py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ color: "#9ca3af", border: "1px solid rgba(255,255,255,0.09)" }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
            e.currentTarget.style.color = "#f9fafb";
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
            e.currentTarget.style.color = "#9ca3af";
            e.currentTarget.style.background = "transparent";
          }
        }}
      >
        <ArrowLeft size={14} /> Back
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={disabled}
        className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: "linear-gradient(135deg, #34d399 0%, #059669 100%)",
          color: "#022c22",
          boxShadow: "0 4px 16px rgba(52,211,153,0.28)",
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.filter = "brightness(1.08)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(52,211,153,0.38)";
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            e.currentTarget.style.filter = "brightness(1)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(52,211,153,0.28)";
          }
        }}
      >
        {nextLabel} <ArrowRight size={14} />
      </button>
    </div>
  );
}

// ── Main Onboarding Page ───────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<"forward" | "backward">("forward");
  const [animKey, setAnimKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<OnboardingData>({
    fullName: "", email: "", country: "India", phoneNumber: "",
    orgName: "", orgType: "Startup", address: "", employees: "1–10",
    city: "", zip: "", state: "",
    eventNumber: "1-5", participantNumber: "50-100", featureType: "QR_Entry",
  });

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || session.user.name || "",
        email: prev.email || session.user.email || "",
      }));
    }
  }, [session]);

  const updateFormData = (fields: Partial<OnboardingData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

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
      const response = await saveOnboardingData(formData);
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
      <div className="min-h-screen w-full flex items-center justify-center" style={{ background: "#0a0f0e" }}>
        <RefreshCw className="w-8 h-8 animate-spin" style={{ color: "#34d399" }} />
      </div>
    );
  }

  const progressPercent = (step / (STEPS.length - 1)) * 100;

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{ background: "linear-gradient(135deg, #0a0f0e 0%, #0d1117 50%, #0a0c10 100%)", fontFamily: "'Inter', sans-serif" }}
    >
      {/* Keyframe styles */}
      <style>{`
        @keyframes slideForward {
          from { opacity: 0; transform: translateX(28px) scale(0.98); }
          to   { opacity: 1; transform: translateX(0)   scale(1);    }
        }
        @keyframes slideBackward {
          from { opacity: 0; transform: translateX(-28px) scale(0.98); }
          to   { opacity: 1; transform: translateX(0)    scale(1);    }
        }
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1);    opacity: 0.15; }
          50%       { transform: scale(1.1); opacity: 0.3;  }
        }
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        @keyframes progressFill {
          from { width: 0%; }
        }
        .anim-slide-forward  { animation: slideForward  0.38s cubic-bezier(0.16,1,0.3,1) forwards; }
        .anim-slide-backward { animation: slideBackward 0.38s cubic-bezier(0.16,1,0.3,1) forwards; }
      `}</style>

      {/* Grid texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(52,211,153,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.025) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── Top nav ─────────────────────────────────────────────────── */}
      <header
        className="relative z-10 flex items-center justify-between px-6 md:px-10 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #34d399 0%, #059669 100%)", boxShadow: "0 2px 12px rgba(52,211,153,0.4)" }}
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M2 7L5.5 10.5L12 3.5" stroke="#022c22" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-base font-semibold tracking-tight" style={{ color: "#f9fafb" }}>Festo</span>
        </div>

        {/* Step pills — desktop */}
        <div className="hidden sm:flex items-center gap-1">
          {STEPS.map((s, i) => {
            const done = step > i;
            const active = step === i;
            return (
              <div key={s.id} className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => { if (done) go(i); }}
                  disabled={!done}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: active ? "rgba(52,211,153,0.15)" : done ? "rgba(52,211,153,0.08)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${active ? "rgba(52,211,153,0.5)" : done ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.07)"}`,
                    color: active ? "#34d399" : done ? "#6ee7b7" : "#4b5563",
                    cursor: done ? "pointer" : "default",
                  }}
                >
                  {done ? <Check size={11} strokeWidth={3} /> : s.icon}
                  <span>{s.label}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div
                    className="w-5 h-px transition-all duration-500"
                    style={{ background: done ? "rgba(52,211,153,0.4)" : "rgba(255,255,255,0.07)" }}
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
                background: i === step ? "#34d399" : i < step ? "#059669" : "rgba(255,255,255,0.12)",
              }}
            />
          ))}
        </div>
      </header>

      {/* ── Progress bar ─────────────────────────────────────────────── */}
      <div className="relative z-10 h-0.5 w-full" style={{ background: "rgba(255,255,255,0.05)" }}>
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${progressPercent}%`,
            background: "linear-gradient(90deg, #34d399, #059669)",
            boxShadow: "0 0 10px rgba(52,211,153,0.5)",
          }}
        />
      </div>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <main className="relative z-10 flex-1 flex items-start md:items-center justify-center p-6 md:p-10">
        <div
          className="w-full max-w-2xl rounded-2xl overflow-hidden relative"
          style={{
            background: "linear-gradient(160deg, rgba(17,24,39,0.97) 0%, rgba(15,20,28,0.99) 100%)",
            border: "1px solid rgba(52,211,153,0.08)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.03), 0 32px 64px rgba(0,0,0,0.7)",
            backdropFilter: "blur(16px)",
          }}
        >
          {/* Card top-border accent */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(52,211,153,0.5) 40%, rgba(16,185,129,0.4) 60%, transparent 100%)",
            }}
          />
          {/* Ambient glow corner */}
          <div
            className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl pointer-events-none"
            style={{ background: "rgba(52,211,153,0.06)", animation: "pulseGlow 6s ease-in-out infinite" }}
          />
          <div
            className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full blur-3xl pointer-events-none"
            style={{ background: "rgba(99,102,241,0.05)", animation: "pulseGlow 8s ease-in-out infinite 2s" }}
          />

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