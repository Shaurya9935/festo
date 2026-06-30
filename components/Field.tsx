import React from "react";
import { Eye, EyeOff } from "lucide-react";

interface FieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  showToggle?: boolean;
  visible?: boolean;
  onToggle?: () => void;
}

export default function Field({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  showToggle,
  visible,
  onToggle,
}: FieldProps) {
  const inputType = showToggle ? (visible ? "text" : "password") : type;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#9cb080" }}>
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
          style={{
            background: "rgba(39,51,56,0.7)",
            border: "1px solid rgba(156,176,128,0.2)",
            color: "#e8ede6",
            boxShadow: "0 1px 3px rgba(0,0,0,0.35)",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "rgba(156,176,128,0.55)";
            e.target.style.boxShadow = "0 0 0 3px rgba(156,176,128,0.09), 0 1px 3px rgba(0,0,0,0.35)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(156,176,128,0.2)";
            e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.35)";
          }}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: "#618764" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#9cb080")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#618764")}
          >
            {visible ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  );
}
