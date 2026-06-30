import React from "react";

export default function SocialBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="flex items-center justify-center gap-2.5 w-full py-2.5 rounded-xl text-sm font-medium transition-all"
      style={{
        background: "rgba(43,87,72,0.35)",
        border: "1px solid rgba(156,176,128,0.18)",
        color: "#c8d8b8",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(43,87,72,0.55)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(156,176,128,0.32)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(43,87,72,0.35)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(156,176,128,0.18)";
      }}
    >
      {icon}
      {label}
    </button>
  );
}
