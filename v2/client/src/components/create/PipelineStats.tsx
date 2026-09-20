import React from "react";

export default function PipelineStats() {
  const stats = [
    {
      icon: "neurology",
      iconColor: "text-primary",
      title: "Neural OCR Active",
      subtitle: "Extracts diagrams, formulas & charts",
    },
    {
      icon: "view_in_ar",
      iconColor: "text-tertiary",
      title: "3D Board Generator",
      subtitle: "WebGL isometric interactive battles",
    },
    {
      icon: "verified",
      iconColor: "text-emerald-400",
      title: "Zero Hallucination",
      subtitle: "Strict grounding in uploaded source data",
    },
  ];

  return (
    <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      {stats.map((item) => (
        <div
          key={item.title}
          className="p-4 rounded-xl bg-surface-container-low/60 backdrop-blur-md border border-outline-variant/20 flex items-center gap-3"
        >
          <div
            className={`w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center ${item.iconColor}`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
          </div>
          <div>
            <div className="font-headline-sm text-xs sm:text-sm font-semibold text-on-surface">
              {item.title}
            </div>
            <div className="font-body-sm text-[12px] text-outline">
              {item.subtitle}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
