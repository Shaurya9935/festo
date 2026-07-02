import React from "react";

export default function SocialBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="flex items-center justify-center gap-2.5 w-full py-2.5 rounded-xl text-sm font-medium transition-all active:scale-[0.98]"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(149,1,1,0.2)",
        color: "#d1d5db",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(149,1,1,0.1)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,0,0,0.3)";
        (e.currentTarget as HTMLButtonElement).style.color = "#f9fafb";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(149,1,1,0.2)";
        (e.currentTarget as HTMLButtonElement).style.color = "#d1d5db";
      }}
    >
      {icon}
      {label}
    </button>
  );
}
