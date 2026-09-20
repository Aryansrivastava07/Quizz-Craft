"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HeroQuizCard3D from "./HeroQuizCard3D";
import ParallaxReveal from "../ui/ParallaxReveal";

export default function HeroSection() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [pinFeedback, setPinFeedback] = useState<string | null>(null);

  const handleQuickPinJoin = () => {
    const trimmed = pin.trim();
    if (!trimmed) {
      router.push("/join");
      return;
    }

    setPinFeedback(`Verifying [${trimmed}]...`);
    setTimeout(() => {
      router.push("/join");
    }, 400);
  };

  return (
    <section
      className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-gutter-mobile md:px-gutter-desktop max-w-max-width-canvas mx-auto z-10"
      id="hero"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Copy Column with Parallax Reveal */}
        <div className="lg:col-span-7 flex flex-col items-start gap-5">
          <ParallaxReveal direction="up" distance={20} delay={50} duration={700}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container/90 border border-outline-variant/50 text-tertiary font-headline-sm text-xs shadow-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
              <span className="tracking-wide uppercase font-label-code text-[11px]">
                Spatial Quiz Engine • Document to Interactive Rooms
              </span>
            </div>
          </ParallaxReveal>

          <ParallaxReveal direction="up" distance={30} delay={150} duration={800}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] lg:leading-[1.15] font-display-hero font-extrabold tracking-tight text-white">
              Turn Static Notes into{" "}
              <span className="bg-gradient-to-r from-primary via-tertiary to-amber-accent bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(208,188,255,0.4)]">
                Interactive 3D Quizzes
              </span>{" "}
              in Seconds
            </h1>
          </ParallaxReveal>

          <ParallaxReveal direction="up" distance={25} delay={250} duration={800}>
            <p className="text-body-lg text-on-surface-variant max-w-2xl text-base sm:text-lg leading-relaxed">
              Upload course notes, syllabi, or slides. Automatically extract key concepts, build adaptive questions, and host real-time interactive game arenas.
            </p>
          </ParallaxReveal>

          {/* Action Cluster */}
          <ParallaxReveal direction="up" distance={25} delay={350} duration={800} className="w-full">
            <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <Link
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary-container via-secondary-container to-tertiary text-white font-headline-sm text-sm font-semibold shadow-xl shadow-primary-container/25 hover:shadow-primary-container/50 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                href="/create"
              >
                <span className="material-symbols-outlined text-lg">bolt</span>
                <span>Create a Quiz</span>
              </Link>

              {/* PIN Join Box */}
              <div className="relative flex-1 min-w-[220px]">
                <input
                  className="w-full bg-surface-container/90 border border-outline-variant/70 rounded-xl px-4 py-3 text-on-surface placeholder:text-outline focus:outline-none focus:border-tertiary focus:ring-2 focus:ring-tertiary/30 font-label-code text-sm transition-all"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleQuickPinJoin()}
                  placeholder={pinFeedback || "Enter Room PIN (e.g. 884-219)"}
                  type="text"
                />
                <button
                  onClick={handleQuickPinJoin}
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-surface-bright text-tertiary hover:bg-tertiary hover:text-surface-container-lowest transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                >
                  <span>Join</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </ParallaxReveal>

          {/* Simple Metrics with Staggered Fade-in */}
          <ParallaxReveal direction="up" distance={20} delay={450} duration={800} className="w-full">
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-outline-variant/20 w-full mt-1">
              <div className="transition-transform hover:scale-105 duration-200">
                <div className="font-stat-counter text-xl sm:text-2xl font-bold text-primary">
                  120,000+
                </div>
                <div className="text-on-surface-variant text-xs sm:text-sm">
                  Quizzes Created
                </div>
              </div>
              <div className="transition-transform hover:scale-105 duration-200">
                <div className="font-stat-counter text-xl sm:text-2xl font-bold text-tertiary">
                  98.4%
                </div>
                <div className="text-on-surface-variant text-xs sm:text-sm">
                  Recall Boost
                </div>
              </div>
              <div className="transition-transform hover:scale-105 duration-200">
                <div className="font-stat-counter text-xl sm:text-2xl font-bold text-amber-accent">
                  15,000+
                </div>
                <div className="text-on-surface-variant text-xs sm:text-sm">
                  Active Educators
                </div>
              </div>
            </div>
          </ParallaxReveal>
        </div>

        {/* Right 3D Perspective Card Rig with Smooth Parallax Entrance */}
        <ParallaxReveal direction="left" distance={40} delay={200} duration={900} className="lg:col-span-5 w-full">
          <HeroQuizCard3D />
        </ParallaxReveal>
      </div>
    </section>
  );
}
