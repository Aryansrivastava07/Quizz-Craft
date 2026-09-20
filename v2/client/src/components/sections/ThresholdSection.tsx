"use client";

import React, { useState } from "react";
import Link from "next/link";
import ChapterBadge from "../ui/ChapterBadge";
import GlassCard from "../ui/GlassCard";
import ParallaxReveal from "../ui/ParallaxReveal";

export default function ThresholdSection() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannerTitle, setScannerTitle] = useState(
    "Drop syllabus.pdf or presentation.deck"
  );
  const [scannerBtnLabel, setScannerBtnLabel] = useState(
    "Click to Test Ingestion"
  );
  const [phase1Label, setPhase1Label] = useState("100% Extracted");
  const [phase2Label, setPhase2Label] = useState("15 Questions Ready");
  const [phase3Label, setPhase3Label] = useState("PIN: 884-219");

  const runScannerExtraction = () => {
    if (isScanning) return;
    setIsScanning(true);

    setScannerTitle("Scanning Quantum_Physics.pdf (18.4MB)...");
    setScannerBtnLabel("Extracting Key Concepts...");

    setPhase1Label("Reading document...");
    setPhase2Label("Formulating questions...");
    setPhase3Label("Building 3D cards...");

    setTimeout(() => {
      setPhase1Label("Concepts Extracted (100%)");
      setPhase2Label("15 Questions Ready");
      setPhase3Label("Ready to Play // PIN: 884-219");
      setScannerTitle("Complete! 3D Quiz Generated");
      setScannerBtnLabel("Scan Another File");
      setIsScanning(false);
    }, 1100);
  };

  return (
    <section
      className="py-20 px-gutter-mobile md:px-gutter-desktop max-w-max-width-canvas mx-auto relative z-10"
      id="ch-01"
    >
      <ParallaxReveal direction="up" distance={30} duration={750}>
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10">
          <ChapterBadge
            title="INSTANT INGESTION"
            variant="tertiary"
          />
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-white font-headline-xl font-bold">
            Drop Any Document. We Do The Rest.
          </h2>
          <p className="text-body-md text-on-surface-variant max-w-xl mt-2 text-sm sm:text-base">
            Feed raw syllabi, slide decks, or textbook chapters. Watch our AI analyze the material and create a ready-to-host quiz in seconds.
          </p>
        </div>
      </ParallaxReveal>

      {/* Interactive Dropzone with Parallax Reveal */}
      <ParallaxReveal direction="up" distance={35} delay={120} duration={850} parallaxSpeed={0.02}>
        <GlassCard className="rounded-3xl border-outline-variant/40 p-6 md:p-10 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-primary/40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Drop Target Area */}
            <div
              onClick={runScannerExtraction}
              className="lg:col-span-6 relative flex flex-col items-center justify-center border-2 border-dashed border-tertiary/40 hover:border-tertiary rounded-2xl p-8 bg-surface-container/40 hover:bg-surface-container/70 transition-all cursor-pointer group text-center overflow-hidden min-h-[260px] active:scale-[0.99]"
            >
              {/* Scanning Laser */}
              <div className="absolute left-0 right-0 h-[2px] bg-tertiary laser-scanner pointer-events-none" />

              <div className="w-14 h-14 rounded-2xl bg-surface-container-high border border-tertiary/40 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-inner shadow-tertiary/20">
                <span className="material-symbols-outlined text-tertiary text-2xl group-hover:animate-bounce">
                  upload_file
                </span>
              </div>

              <h4 className="text-headline-sm text-white font-semibold text-base sm:text-lg mb-1">
                {scannerTitle}
              </h4>
              <p className="text-body-sm text-on-surface-variant text-xs mb-4">
                Supports PDF, DOCX, TXT up to 50MB
              </p>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-bright text-white font-headline-sm text-xs group-hover:bg-tertiary-container transition-all shadow-md group-hover:scale-105">
                <span className="material-symbols-outlined text-sm">
                  document_scanner
                </span>
                <span>{scannerBtnLabel}</span>
              </div>
            </div>

            {/* Simple Pipeline Visualizer */}
            <div className="lg:col-span-6 flex flex-col gap-3">
              {/* Phase 1 */}
              <div className="p-3.5 rounded-xl bg-surface-container/90 border border-outline-variant/30 flex items-center gap-3.5 transition-transform hover:translate-x-1 duration-200">
                <div className="w-9 h-9 rounded-xl bg-primary-container/20 border border-primary-container/40 flex items-center justify-center text-primary font-stat-counter text-xs font-bold">
                  1
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs sm:text-sm font-semibold text-white">
                      Extract Core Concepts
                    </span>
                    <span className="font-label-code text-xs text-tertiary">
                      {phase1Label}
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-primary to-tertiary h-full w-full rounded-full transition-all duration-700" />
                  </div>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="p-3.5 rounded-xl bg-surface-container/90 border border-outline-variant/30 flex items-center gap-3.5 transition-transform hover:translate-x-1 duration-200">
                <div className="w-9 h-9 rounded-xl bg-tertiary-container/20 border border-tertiary-container/40 flex items-center justify-center text-tertiary font-stat-counter text-xs font-bold">
                  2
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs sm:text-sm font-semibold text-white">
                      Formulate Balanced Questions
                    </span>
                    <span className="font-label-code text-xs text-secondary">
                      {phase2Label}
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-tertiary to-secondary h-full w-full rounded-full transition-all duration-700" />
                  </div>
                </div>
              </div>

              {/* Phase 3 */}
              <div className="p-3.5 rounded-xl bg-surface-container/90 border border-outline-variant/30 flex items-center gap-3.5 transition-transform hover:translate-x-1 duration-200">
                <div className="w-9 h-9 rounded-xl bg-amber-accent/20 border border-amber-accent/40 flex items-center justify-center text-amber-accent font-stat-counter text-xs font-bold">
                  3
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs sm:text-sm font-semibold text-white">
                      Launch Interactive 3D Room
                    </span>
                    <span className="font-label-code text-xs text-amber-accent">
                      {phase3Label}
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-secondary to-amber-accent h-full w-full rounded-full transition-all duration-700" />
                  </div>
                </div>
              </div>

              {/* Quick action button */}
              <div className="pt-2">
                <Link
                  href="/create"
                  className="w-full py-2.5 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 text-on-surface hover:text-white text-xs font-headline-sm font-semibold flex items-center justify-center gap-1.5 transition-all hover:border-primary/40 hover:scale-[1.01] active:scale-95"
                >
                  <span>Upload Your Own PDF</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </GlassCard>
      </ParallaxReveal>
    </section>
  );
}
