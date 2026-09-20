"use client";

import React from "react";

export type SourceType = "text" | "images" | "videos" | "pdf";

interface SourceItem {
  id: SourceType;
  title: string;
  subtitle: string;
  icon: string;
  colorTheme: "emerald" | "violet" | "tertiary" | "amber";
}

const sources: SourceItem[] = [
  {
    id: "text",
    title: "Text Prompt",
    subtitle: "Notes, raw markdown",
    icon: "description",
    colorTheme: "tertiary",
  },
  {
    id: "images",
    title: "Images",
    subtitle: "Diagrams & slides",
    icon: "image",
    colorTheme: "emerald",
  },
  {
    id: "videos",
    title: "Videos",
    subtitle: "YouTube, MP4 files",
    icon: "videocam",
    colorTheme: "violet",
  },
  {
    id: "pdf",
    title: "PDF Files",
    subtitle: "Textbooks, syllabi",
    icon: "picture_as_pdf",
    colorTheme: "amber",
  },
];

interface SourceSelectorProps {
  activeSources: SourceType[];
  onToggleSource: (id: SourceType) => void;
}

export default function SourceSelector({
  activeSources,
  onToggleSource,
}: SourceSelectorProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-headline-sm text-lg font-semibold text-on-surface">
            Select Content Sources
          </h2>
          <span className="text-outline text-xs font-label-code">
            • Multi-Modal
          </span>
        </div>
        <span className="px-2.5 py-1 rounded-full font-label-code text-xs bg-tertiary/15 text-tertiary border border-tertiary/30">
          {activeSources.length} Source{activeSources.length !== 1 ? "s" : ""}{" "}
          Active
        </span>
      </div>

      {/* 4-Column Source Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sources.map((item) => {
          const isActive = activeSources.includes(item.id);

          if (item.id === "images") {
            return (
              <div
                key={item.id}
                onClick={() => onToggleSource(item.id)}
                role="button"
                tabIndex={0}
                className={`relative rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer min-h-[140px] active:scale-95 ${
                  isActive
                    ? "bg-surface-container/90 border-2 border-emerald-active scale-[1.02]"
                    : "bg-surface-container/60 hover:bg-surface-container/90 border border-outline-variant/40 hover:border-outline"
                }`}
              >
                {isActive && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "14px" }}
                    >
                      check
                    </span>
                  </div>
                )}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-transform ${
                    isActive
                      ? "bg-emerald-950/40 border border-emerald-500/30 text-emerald-400"
                      : "bg-surface-container-highest/60 text-outline hover:text-on-surface"
                  }`}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "26px" }}
                  >
                    {item.icon}
                  </span>
                </div>
                <span
                  className={`font-headline-sm text-sm font-semibold ${
                    isActive ? "text-emerald-300" : "text-on-surface"
                  }`}
                >
                  {item.title}
                </span>
                <span
                  className={`font-body-sm text-[12px] mt-0.5 ${
                    isActive ? "text-on-surface-variant" : "text-outline"
                  }`}
                >
                  {item.subtitle}
                </span>
              </div>
            );
          }

          if (item.id === "videos") {
            return (
              <div
                key={item.id}
                onClick={() => onToggleSource(item.id)}
                role="button"
                tabIndex={0}
                className={`relative rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer min-h-[140px] active:scale-95 ${
                  isActive
                    ? "bg-surface-container/90 border-2 border-violet-active scale-[1.02]"
                    : "bg-surface-container/60 hover:bg-surface-container/90 border border-outline-variant/40 hover:border-outline"
                }`}
              >
                {isActive && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary-container/30 text-primary border border-primary/40 flex items-center justify-center">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "14px" }}
                    >
                      check
                    </span>
                  </div>
                )}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-transform ${
                    isActive
                      ? "bg-primary-container/20 border border-primary/30 text-primary"
                      : "bg-surface-container-highest/60 text-outline hover:text-on-surface"
                  }`}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "26px" }}
                  >
                    {item.icon}
                  </span>
                </div>
                <span
                  className={`font-headline-sm text-sm font-semibold ${
                    isActive ? "text-primary" : "text-on-surface"
                  }`}
                >
                  {item.title}
                </span>
                <span
                  className={`font-body-sm text-[12px] mt-0.5 ${
                    isActive ? "text-on-surface-variant" : "text-outline"
                  }`}
                >
                  {item.subtitle}
                </span>
              </div>
            );
          }

          // Text & PDF
          return (
            <div
              key={item.id}
              onClick={() => onToggleSource(item.id)}
              role="button"
              tabIndex={0}
              className={`group relative rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer min-h-[140px] active:scale-95 ${
                isActive
                  ? "bg-surface-container/90 border-2 border-primary-container scale-[1.02]"
                  : "bg-surface-container/60 hover:bg-surface-container/90 border border-outline-variant/40 hover:border-outline"
              }`}
            >
              {isActive && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary-container/30 text-primary border border-primary/40 flex items-center justify-center">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "14px" }}
                  >
                    check
                  </span>
                </div>
              )}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-transform group-hover:scale-105 ${
                  isActive
                    ? "bg-primary-container/20 text-primary"
                    : "bg-surface-container-highest/60 text-outline group-hover:text-on-surface"
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "26px" }}
                >
                  {item.icon}
                </span>
              </div>
              <span
                className={`font-headline-sm text-sm font-semibold ${
                  isActive ? "text-primary" : "text-on-surface"
                }`}
              >
                {item.title}
              </span>
              <span className="font-body-sm text-[12px] text-outline mt-0.5">
                {item.subtitle}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
