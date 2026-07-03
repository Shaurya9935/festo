import React from "react";

export default function SocialBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="flex items-center justify-center gap-2.5 w-full py-2.5 rounded-xl text-sm font-medium transition-all active:scale-[0.98]"
      style={{
        background: "rgba(76,58,81,0.04)",
        border: "1px solid rgba(178,80,104,0.2)",
        color: "#4C3A51",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(178,80,104,0.08)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(178,80,104,0.35)";
        (e.currentTarget as HTMLButtonElement).style.color = "#774360";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(76,58,81,0.04)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(178,80,104,0.2)";
        (e.currentTarget as HTMLButtonElement).style.color = "#4C3A51";
      }}
    >
      {icon}
      {label}
    </button>
  );
}
