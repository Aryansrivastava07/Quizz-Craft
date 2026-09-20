import React from "react";
import ChapterBadge from "../ui/ChapterBadge";
import GlassCard from "../ui/GlassCard";
import ParallaxReveal from "../ui/ParallaxReveal";

interface StepItem {
  num: string;
  numColor: string;
  icon: string;
  iconBg: string;
  title: string;
  description: string;
  badgeLabel: string;
}

const steps: StepItem[] = [
  {
    num: "1",
    numColor: "text-primary/40 group-hover:text-primary",
    icon: "cloud_upload",
    iconBg: "group-hover:bg-primary-container/20 text-primary",
    title: "Upload Your Content",
    description:
      "Drop any lecture notes, syllabus PDF, research paper, or enter a prompt topic. Our parser extracts the key concepts instantly.",
    badgeLabel: "Instant Parsing",
  },
  {
    num: "2",
    numColor: "text-tertiary/40 group-hover:text-tertiary",
    icon: "tune",
    iconBg: "group-hover:bg-tertiary-container/20 text-tertiary",
    title: "Customize & Preview",
    description:
      "Choose question count, difficulty, and formats like Multiple Choice or True/False. Review and edit questions in our intuitive editor.",
    badgeLabel: "Full Control",
  },
  {
    num: "3",
    numColor: "text-amber-accent/40 group-hover:text-amber-accent",
    icon: "play_circle",
    iconBg: "group-hover:bg-amber-accent/20 text-amber-accent",
    title: "Host Live & Compete",
    description:
      "Share a 6-digit game PIN or QR code. Players join from mobile or desktop with real-time scoring, streaks, and leaderboards.",
    badgeLabel: "Live Multiplayer",
  },
];

export default function SacredSynthesisSection() {
  return (
    <section
      className="py-20 px-gutter-mobile md:px-gutter-desktop max-w-max-width-canvas mx-auto relative z-10"
      id="how-it-works"
    >
      <ParallaxReveal direction="up" distance={30} duration={750}>
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12">
          <ChapterBadge
            title="THREE-STEP WORKFLOW"
            variant="primary"
          />
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-white font-headline-xl font-bold">
            How It Works
          </h2>
          <p className="text-body-md text-on-surface-variant max-w-xl mt-2 text-sm sm:text-base">
            From static documents to interactive 3D quiz rooms in under a minute.
          </p>
        </div>
      </ParallaxReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {steps.map((step, idx) => (
          <ParallaxReveal
            key={step.num}
            direction="up"
            distance={35}
            delay={idx * 140}
            duration={800}
            parallaxSpeed={0.015}
            className="h-full"
          >
            <GlassCard
              hoverEffect
              className="rounded-2xl p-6 sm:p-7 flex flex-col justify-between group border-outline-variant/30 h-full transition-all duration-300 hover:border-primary/40 hover:-translate-y-1.5"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span
                    className={`font-stat-counter text-3xl font-bold transition-colors ${step.numColor}`}
                  >
                    {step.num}
                  </span>
                  <div
                    className={`w-11 h-11 rounded-xl bg-surface-container-high border border-outline-variant/40 flex items-center justify-center group-hover:scale-110 transition-all shadow-md ${step.iconBg}`}
                  >
                    <span className="material-symbols-outlined text-2xl">
                      {step.icon}
                    </span>
                  </div>
                </div>
                <h3 className="font-headline-lg text-white text-lg sm:text-xl font-bold">
                  {step.title}
                </h3>
                <p className="text-body-sm text-on-surface-variant text-xs sm:text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs">
                <span className="text-primary font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  {step.badgeLabel}
                </span>
                <span className="text-outline text-xs">Step {step.num} of 3</span>
              </div>
            </GlassCard>
          </ParallaxReveal>
        ))}
      </div>
    </section>
  );
}
