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
        <label
          className="text-xs font-medium uppercase tracking-widest"
          style={{ color: "#6b7280" }}
        >
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
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.09)",
            color: "#f9fafb",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3)",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "rgba(52,211,153,0.45)";
            e.target.style.boxShadow =
              "0 0 0 3px rgba(52,211,153,0.08), inset 0 1px 2px rgba(0,0,0,0.3)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(255,255,255,0.09)";
            e.target.style.boxShadow = "inset 0 1px 2px rgba(0,0,0,0.3)";
          }}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: "#6b7280" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = "#9ca3af")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = "#6b7280")
            }
          >
            {visible ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  );
}
