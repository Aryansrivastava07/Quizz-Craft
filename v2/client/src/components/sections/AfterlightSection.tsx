"use client";

import React from "react";
import Link from "next/link";
import ChapterBadge from "../ui/ChapterBadge";
import ParallaxReveal from "../ui/ParallaxReveal";

export default function AfterlightSection() {
  return (
    <section
      className="py-20 px-gutter-mobile md:px-gutter-desktop max-w-max-width-canvas mx-auto relative z-10"
      id="ch-05"
    >
      <ParallaxReveal direction="up" distance={35} duration={850} parallaxSpeed={0.02}>
        {/* Sleek Single-Color Surface - No Harsh Visible Gradient or Colored Orbs */}
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 md:p-14 bg-[#0a0d18] border border-outline-variant/40 shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-5">
            <ChapterBadge
              title="STUDIO ACCESS"
              variant="primary"
            />

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline-xl font-extrabold text-white leading-tight">
              Ready to Transform Your Content?
            </h2>

            <p className="text-body-md text-on-surface-variant text-sm sm:text-base max-w-xl mx-auto">
              Turn notes, syllabi, and presentations into memorable 3D quizzes in under 60 seconds.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2">
              <Link
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary-container hover:bg-primary-container/90 text-white font-headline-sm font-semibold shadow-sm border border-white/10 active:scale-95 transition-all cursor-pointer"
                href="/create"
              >
                <span className="material-symbols-outlined text-lg">bolt</span>
                <span>Create a Quiz Free</span>
              </Link>

              <Link
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-outline-variant/60 text-on-surface hover:text-white font-headline-sm text-sm hover:border-tertiary bg-surface-container/60 transition-all cursor-pointer"
                href="/join"
              >
                <span className="material-symbols-outlined text-base">sports_esports</span>
                <span>Join a Live Game</span>
              </Link>
            </div>

            <div className="pt-2 text-xs text-outline flex flex-wrap items-center justify-center gap-4">
              <span className="flex items-center gap-1 text-on-surface-variant">
                <span className="text-tertiary">✓</span> No credit card required
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-on-surface-variant">
                <span className="text-tertiary">✓</span> Free for educators
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-on-surface-variant">
                <span className="text-tertiary">✓</span> Any device & browser
              </span>
            </div>
          </div>
        </div>
      </ParallaxReveal>
    </section>
  );
}
