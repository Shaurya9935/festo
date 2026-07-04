"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  Sparkles,
  Calendar,
  MapPin,
  FileText,
  Check,
  CloudUpload,
  DownloadCloud,
  Mail,
  Printer,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useState } from "react";

// ─── Animation Variants ───────────────────────────────────────────────────────
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.05, staggerDirection: -1 as const },
  },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 20 },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

// ─── Shared underline input ───────────────────────────────────────────────────
interface UnderlineInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}
export function UnderlineInput({ label, error, className, ...props }: UnderlineInputProps) {
  return (
    <div className="relative group">
      <label className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-1 block">
        {label}
      </label>
      <input
        {...props}
        className={
          "w-full bg-transparent border-b py-4 font-light text-slate-800 placeholder-slate-300 focus:outline-none transition-colors " +
          (error ? "border-red-400" : "border-slate-200 focus:border-[#774360]") +
          " " + (className ?? "")
        }
      />
      {error && (
        <p className="mt-1.5 text-xs flex items-center gap-1 text-red-500">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Step 1: Event Details ────────────────────────────────────────────────────
export interface Step1Data {
  eventName: string;
  eventVenue: string;
  eventStartAt: string;
  eventEndAt: string;
  eventDescription: string;
}

interface Step1Props {
  data: Step1Data;
  errors: Partial<Record<keyof Step1Data, string>>;
  onChange: (key: keyof Step1Data, value: string) => void;
}

export function Step1Details({ data, errors, onChange }: Step1Props) {
  // Compute min for end based on start
  const nowIso = new Date(Date.now() + 60_000).toISOString().slice(0, 16);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      exit="exit"
      className="flex flex-col max-w-2xl font-['Inter']"
    >
      <motion.div variants={fadeUp} className="space-y-3 mb-16">
        <h1 className="text-4xl font-light tracking-tight text-slate-900 font-['Hanken_Grotesk']">
          Let&apos;s start with the basics
        </h1>
        <p className="text-lg text-slate-500 font-light">
          Set the foundation for your next great experience.
        </p>
      </motion.div>

      <div className="space-y-12">
        <motion.div variants={fadeUp}>
          <UnderlineInput
            label="Event Name"
            placeholder="e.g. Design Leadership Summit"
            value={data.eventName}
            onChange={(e) => onChange("eventName", e.target.value)}
            error={errors.eventName}
            className="text-xl"
            maxLength={50}
          />
          <div className="flex justify-end mt-1">
            <span
              className="text-xs"
              style={{ color: data.eventName.length > 45 ? "#B25068" : "#cbd5e1" }}
            >
              {data.eventName.length}/50
            </span>
          </div>
        </motion.div>

        <motion.div variants={fadeUp}>
          <UnderlineInput
            label="Venue"
            placeholder="Where is it happening?"
            value={data.eventVenue}
            onChange={(e) => onChange("eventVenue", e.target.value)}
            error={errors.eventVenue}
            className="text-xl"
          />
        </motion.div>

        <motion.div variants={fadeUp}>
          <label className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-1 block">
            Description
          </label>
          <textarea
            placeholder="Describe what attendees can expect…"
            value={data.eventDescription}
            onChange={(e) => onChange("eventDescription", e.target.value)}
            rows={3}
            className={
              "w-full bg-transparent border-b py-4 text-lg font-light text-slate-800 placeholder-slate-300 focus:outline-none transition-colors resize-none " +
              (errors.eventDescription ? "border-red-400" : "border-slate-200 focus:border-[#774360]")
            }
          />
          {errors.eventDescription && (
            <p className="mt-1.5 text-xs flex items-center gap-1 text-red-500">
              <AlertCircle size={11} />
              {errors.eventDescription}
            </p>
          )}
        </motion.div>

        <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
          <div>
            <label className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-1 block">
              Start Date
            </label>
            <input
              type="datetime-local"
              value={data.eventStartAt}
              min={nowIso}
              onChange={(e) => {
                onChange("eventStartAt", e.target.value);
                if (data.eventEndAt && e.target.value >= data.eventEndAt) {
                  onChange("eventEndAt", "");
                }
              }}
              className={
                "w-full bg-transparent border-b py-4 text-lg font-light text-slate-800 focus:outline-none transition-colors " +
                (errors.eventStartAt ? "border-red-400" : "border-slate-200 focus:border-[#774360]")
              }
              style={{ colorScheme: "light" }}
            />
            {errors.eventStartAt && (
              <p className="mt-1.5 text-xs flex items-center gap-1 text-red-500">
                <AlertCircle size={11} /> {errors.eventStartAt}
              </p>
            )}
          </div>
          <div>
            <label className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-1 block">
              End Date
            </label>
            <input
              type="datetime-local"
              value={data.eventEndAt}
              min={data.eventStartAt || nowIso}
              onChange={(e) => onChange("eventEndAt", e.target.value)}
              className={
                "w-full bg-transparent border-b py-4 text-lg font-light text-slate-800 focus:outline-none transition-colors " +
                (errors.eventEndAt ? "border-red-400" : "border-slate-200 focus:border-[#774360]")
              }
              style={{ colorScheme: "light" }}
            />
            {errors.eventEndAt && (
              <p className="mt-1.5 text-xs flex items-center gap-1 text-red-500">
                <AlertCircle size={11} /> {errors.eventEndAt}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Step 2: Guest List ───────────────────────────────────────────────────────
interface Step2Props {
  fileName: string | null;
  onFile: (name: string) => void;
}

export function Step2GuestList({ fileName, onFile }: Step2Props) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onFile(file.name);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file.name);
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      exit="exit"
      className="flex flex-col max-w-3xl font-['Inter']"
    >
      <motion.div variants={fadeUp} className="space-y-3 mb-16">
        <h1 className="text-4xl font-light tracking-tight text-slate-900 font-['Hanken_Grotesk']">
          Who is on the list?
        </h1>
        <p className="text-lg text-slate-500 font-light">
          Securely import your attendees using a CSV or Excel file.
        </p>
      </motion.div>

      <motion.div variants={fadeUp}>
        <label
          className="w-full border border-dashed border-[#774360]/20 rounded-2xl bg-white/30 hover:bg-white/60 transition-all duration-500 cursor-pointer group flex flex-col items-center justify-center py-24 px-8 relative overflow-hidden"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            className="sr-only"
            onChange={handleChange}
          />

          <div className="w-16 h-16 rounded-full bg-[#fdf5fa] flex items-center justify-center mb-6 group-hover:-translate-y-2 group-hover:shadow-lg transition-all duration-500 ease-out text-[#774360]">
            <CloudUpload className="w-6 h-6" />
          </div>

          {fileName ? (
            <>
              <h3 className="text-xl font-medium text-slate-800 mb-2 font-['Hanken_Grotesk']">
                {fileName}
              </h3>
              <p className="text-sm text-slate-400 mb-8">File selected — click to change</p>
            </>
          ) : (
            <>
              <h3 className="text-xl font-medium text-slate-800 mb-2 font-['Hanken_Grotesk']">
                Drag &amp; drop your file
              </h3>
              <p className="text-sm text-slate-400 mb-8">or click to browse your computer</p>
            </>
          )}

          <div className="text-xs font-semibold tracking-widest uppercase text-[#774360] opacity-80 group-hover:opacity-100 transition-opacity flex items-center">
            Select File{" "}
            <ArrowRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </label>
      </motion.div>
    </motion.div>
  );
}

// ─── Step 3: Badge Design ─────────────────────────────────────────────────────
const BADGE_TEMPLATES = [
  { id: 1, name: "Minimalist", color: "bg-slate-800", text: "Clean & Simple" },
  { id: 2, name: "Vibrant Core", color: "bg-gradient-to-br from-[#B25068] to-[#E7AB79]", text: "Bold & Colorful" },
  { id: 3, name: "Corporate", color: "bg-blue-900", text: "Professional" },
  { id: 4, name: "Elite", color: "bg-[#4C3A51]", text: "Premium Dark" },
];

interface Step3Props {
  selectedTemplate: number;
  onSelect: (id: number) => void;
}

export function Step3Badges({ selectedTemplate, onSelect }: Step3Props) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      exit="exit"
      className="flex flex-col font-['Inter'] w-full"
    >
      <motion.div variants={fadeUp} className="space-y-3 mb-16">
        <h1 className="text-4xl font-light tracking-tight text-slate-900 font-['Hanken_Grotesk']">
          Choose a template
        </h1>
        <p className="text-lg text-slate-500 font-light">
          Give your attendees a beautiful physical keepsake.
        </p>
      </motion.div>

      <motion.div variants={fadeUp} className="w-full">
        <div
          className="flex gap-8 overflow-x-auto pb-12 pt-4 pr-12 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {BADGE_TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => onSelect(tpl.id)}
              className={`snap-center min-w-[240px] h-[340px] rounded-2xl p-5 cursor-pointer transition-all duration-500 relative flex flex-col justify-between group ${
                selectedTemplate === tpl.id
                  ? "ring-2 ring-offset-8 ring-[#774360] ring-offset-[#fdf5fa] bg-white scale-[1.02]"
                  : "hover:scale-[1.02] bg-white/40 hover:bg-white"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-medium text-slate-800 font-['Hanken_Grotesk']">{tpl.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">{tpl.text}</p>
                </div>
                {selectedTemplate === tpl.id && (
                  <motion.div
                    layoutId="badge-check"
                    className="w-5 h-5 rounded-full bg-[#774360] flex items-center justify-center shadow-md"
                  >
                    <Check className="w-3 h-3 text-white stroke-[3]" />
                  </motion.div>
                )}
              </div>

              {/* Mock ID card */}
              <div className={`w-full h-24 rounded-xl ${tpl.color} mb-6 transition-all duration-500 group-hover:shadow-md`} />
              <div className="space-y-3 flex-1 px-1">
                <div className="w-12 h-12 rounded-full bg-slate-200 border-2 border-white -mt-12 shadow-sm relative z-10" />
                <div className="w-2/3 h-3 bg-slate-200 rounded-full" />
                <div className="w-1/3 h-2 bg-slate-200 rounded-full" />
                <div className="w-full h-10 mt-auto bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200/50">
                  <span className="text-[10px] text-slate-400 font-mono tracking-widest">BARCODE</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Step 4: Review ───────────────────────────────────────────────────────────
interface Step4Props {
  eventName: string;
  eventVenue: string;
  eventStartAt: string;
  eventEndAt: string;
  guestFileName: string | null;
  selectedTemplate: number;
  onPublish: () => void;
  loading: boolean;
  error?: string;
}

function formatDateRange(start: string, end: string): string {
  if (!start) return "—";
  const s = new Date(start);
  const e = end ? new Date(end) : null;
  const opts: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" };
  if (!e) return s.toLocaleDateString("en-US", opts);
  if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
    return `${s.toLocaleDateString("en-US", { month: "long", day: "numeric" })} – ${e.toLocaleDateString("en-US", { day: "numeric", year: "numeric" })}`;
  }
  return `${s.toLocaleDateString("en-US", opts)} – ${e.toLocaleDateString("en-US", opts)}`;
}

function templateName(id: number): string {
  return BADGE_TEMPLATES.find((t) => t.id === id)?.name ?? "—";
}

export function Step4Review({ eventName, eventVenue, eventStartAt, eventEndAt, guestFileName, selectedTemplate, onPublish, loading, error }: Step4Props) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      exit="exit"
      className="flex flex-col max-w-4xl font-['Inter']"
    >
      <motion.div variants={fadeUp} className="space-y-3 mb-16">
        <h1 className="text-4xl font-light tracking-tight text-slate-900 font-['Hanken_Grotesk']">
          Ready to launch
        </h1>
        <p className="text-lg text-slate-500 font-light">
          Review your setup before we generate the assets.
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="grid grid-cols-1 md:grid-cols-12 gap-x-12 gap-y-16 mb-20 relative"
      >
        {/* Decorative subtle lines */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-200/50 -translate-x-1/2" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-200/50 -translate-y-1/2" />

        {/* Event Basics */}
        <div className="col-span-1 md:col-span-6 flex flex-col justify-center pr-0 md:pr-8 py-4 relative z-10">
          <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#774360] mb-4">
            Event Basics
          </h3>
          <p className="text-2xl font-light text-slate-900 font-['Hanken_Grotesk'] mb-6">
            {eventName || "—"}
          </p>
          <div className="space-y-4 text-sm text-slate-600 font-light">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-3 text-slate-400 shrink-0" />
              {eventVenue || "—"}
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-3 text-slate-400 shrink-0" />
              {formatDateRange(eventStartAt, eventEndAt)}
            </div>
          </div>
        </div>

        {/* Guest List */}
        <div className="col-span-1 md:col-span-6 flex flex-col justify-center pl-0 md:pl-8 py-4 relative z-10">
          <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#774360] mb-4">
            Guest List
          </h3>
          <div className="flex items-start">
            <FileText className="w-5 h-5 mr-4 text-slate-400 mt-1 shrink-0" />
            <div>
              <p className="text-xl font-light text-slate-900 font-['Hanken_Grotesk']">
                {guestFileName ? "Imported" : "No file uploaded"}
              </p>
              <p className="text-sm text-slate-500 mt-1 font-light">
                {guestFileName ?? "Guest list is optional"}
              </p>
            </div>
          </div>
        </div>

        {/* Visual Identity */}
        <div className="col-span-1 md:col-span-6 flex flex-col justify-center pr-0 md:pr-8 py-4 relative z-10">
          <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#774360] mb-4">
            Visual Identity
          </h3>
          <div className="flex items-start">
            <Sparkles className="w-5 h-5 mr-4 text-slate-400 mt-1 shrink-0" />
            <div>
              <p className="text-xl font-light text-slate-900 font-['Hanken_Grotesk']">
                {templateName(selectedTemplate)} Template
              </p>
              <p className="text-sm text-slate-500 mt-1 font-light">
                Double-sided lanyard passes
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Error */}
      {error && (
        <motion.div variants={fadeUp} className="mb-8">
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-red-600 bg-red-50 border border-red-200">
            <AlertCircle size={14} className="shrink-0" />
            {error}
          </div>
        </motion.div>
      )}

      <motion.div variants={fadeUp}>
        <button
          onClick={onPublish}
          disabled={loading}
          className="group relative inline-flex items-center justify-center px-10 py-5 text-sm font-semibold tracking-widest uppercase text-white transition-all duration-500 ease-out bg-gradient-to-r from-[#B25068] to-[#774360] rounded-full hover:scale-[1.02] hover:shadow-[0_10px_40px_-10px_rgba(178,80,104,0.6)] focus:outline-none overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
        >
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          <span className="relative flex items-center font-['Inter'] gap-3">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Publishing…
              </>
            ) : (
              <>
                Publish Event
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </span>
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Step 5: Launchpad ────────────────────────────────────────────────────────
interface Step5Props {
  eventName: string;
}

export function Step5Launchpad({ eventName }: Step5Props) {
  const actions = [
    {
      icon: DownloadCloud,
      title: "Download Assets",
      desc: "Get QR codes & print-ready PDFs.",
      hoverText: "text-[#774360]",
    },
    {
      icon: Mail,
      title: "Email Guests",
      desc: "Send out digital tickets instantly.",
      hoverText: "text-[#B25068]",
    },
    {
      icon: Printer,
      title: "Print Layouts",
      desc: "Send directly to your local printer.",
      hoverText: "text-[#E7AB79]",
    },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="flex flex-col max-w-4xl h-full justify-center pb-20 font-['Inter']"
    >
      <motion.div variants={fadeUp} className="space-y-6 mb-20">
        <div className="inline-flex items-center text-[10px] tracking-[0.2em] font-semibold text-[#B25068] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B25068] mr-3 animate-pulse" />
          Live &amp; Ready
        </div>
        <h1 className="text-5xl font-light tracking-tight text-slate-900 font-['Hanken_Grotesk']">
          What&apos;s next?
        </h1>
        <p className="text-xl text-slate-500 font-light max-w-xl leading-relaxed">
          <span className="text-slate-800 font-medium">&quot;{eventName}&quot;</span> is live! Your event assets are generated. Choose an action to distribute your materials.
        </p>
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {actions.map((action, idx) => (
          <button
            key={idx}
            className="group bg-transparent border border-slate-200/60 p-8 rounded-2xl hover:border-transparent hover:bg-white transition-all duration-500 flex flex-col items-start text-left shadow-none hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1 relative"
          >
            <div className="w-12 h-12 rounded-full bg-slate-100/50 group-hover:bg-slate-50 flex items-center justify-center mb-10 transition-colors duration-500 text-slate-400 group-hover:text-slate-800">
              <action.icon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-2 font-['Hanken_Grotesk']">
              {action.title}
            </h3>
            <p className="text-sm text-slate-500 font-light leading-relaxed">{action.desc}</p>
            <ArrowRight
              className={`absolute bottom-8 right-8 w-4 h-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ${action.hoverText}`}
            />
          </button>
        ))}
      </motion.div>
    </motion.div>
  );
}
