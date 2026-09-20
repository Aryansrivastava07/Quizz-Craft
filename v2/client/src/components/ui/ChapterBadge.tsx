import React from "react";

interface ChapterBadgeProps {
  title: string;
  variant?: "tertiary" | "primary" | "amber";
  className?: string;
}

export default function ChapterBadge({
  title,
  variant = "tertiary",
  className = "",
}: ChapterBadgeProps) {
  const colorMap = {
    tertiary: "text-tertiary border-tertiary/30 bg-tertiary/5",
    primary: "text-primary border-primary/30 bg-primary/5",
    amber: "text-amber-accent border-amber-accent/30 bg-amber-accent/5",
  };

  const dotMap = {
    tertiary: "bg-tertiary",
    primary: "bg-primary",
    amber: "bg-amber-accent",
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-label-code text-[11px] font-semibold tracking-wider uppercase border mb-3 backdrop-blur-sm shadow-sm ${colorMap[variant]} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotMap[variant]}`} />
      <span>{title}</span>
    </div>
  );
}
