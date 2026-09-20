import React from "react";
import ChapterBadge from "../ui/ChapterBadge";
import GlassCard from "../ui/GlassCard";
import ParallaxReveal from "../ui/ParallaxReveal";

interface FeatureItem {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  badge: string;
  badgeColor: string;
}

const features: FeatureItem[] = [
  {
    icon: "document_scanner",
    iconBg: "bg-primary-container/20 border-primary/30",
    iconColor: "text-primary",
    title: "Document Intelligence",
    description:
      "Upload complex PDFs, slides, and notes. Our AI extracts formulas, key facts, and definitions automatically.",
    badge: "Smart Extraction",
    badgeColor: "text-primary",
  },
  {
    icon: "view_in_ar",
    iconBg: "bg-tertiary-container/20 border-tertiary/30",
    iconColor: "text-tertiary",
    title: "Interactive 3D UI",
    description:
      "Engaging card animations, streak multipliers, and instant visual feedback designed for active recall.",
    badge: "Spatial Engine",
    badgeColor: "text-tertiary",
  },
  {
    icon: "groups",
    iconBg: "bg-amber-accent/15 border-amber-accent/30",
    iconColor: "text-amber-accent",
    title: "Live Multiplayer",
    description:
      "Host live sessions with a quick 6-digit PIN. Real-time class leaderboards and answer distributions.",
    badge: "Instant Sync",
    badgeColor: "text-amber-accent",
  },
  {
    icon: "insights",
    iconBg: "bg-secondary-container/20 border-secondary/30",
    iconColor: "text-secondary",
    title: "Class Analytics",
    description:
      "Track student mastery, identify confusing topics, and export detailed results in one click.",
    badge: "Deep Insights",
    badgeColor: "text-secondary",
  },
];

export default function KineticMasterySection() {
  return (
    <section
      className="py-20 px-gutter-mobile md:px-gutter-desktop max-w-max-width-canvas mx-auto relative z-10"
      id="ch-03"
    >
      <ParallaxReveal direction="up" distance={30} duration={750}>
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12">
          <ChapterBadge
            title="PLATFORM FEATURES"
            variant="tertiary"
          />
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-white font-headline-xl font-bold">
            Built for High-Impact Learning
          </h2>
          <p className="text-body-md text-on-surface-variant max-w-xl mt-2 text-sm sm:text-base">
            Everything educators and learners need to turn documents into memorable study games.
          </p>
        </div>
      </ParallaxReveal>

      {/* 4-Feature Bento Grid with Staggered Parallax Slide-in */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map((feat, idx) => (
          <ParallaxReveal
            key={feat.title}
            direction="up"
            distance={35}
            delay={idx * 110}
            duration={800}
            parallaxSpeed={0.012}
            className="h-full"
          >
            <GlassCard
              hoverEffect
              className="p-6 rounded-2xl border-outline-variant/30 flex flex-col justify-between h-full transition-all duration-300 hover:border-tertiary/40 hover:-translate-y-1.5"
            >
              <div>
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 border ${feat.iconBg} ${feat.iconColor}`}
                >
                  <span className="material-symbols-outlined text-2xl">
                    {feat.icon}
                  </span>
                </div>
                <h3 className="text-headline-sm text-white text-base sm:text-lg font-semibold mb-2">
                  {feat.title}
                </h3>
                <p className="text-body-sm text-on-surface-variant text-xs sm:text-sm leading-relaxed">
                  {feat.description}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-outline-variant/20">
                <span className={`font-label-code text-xs font-semibold ${feat.badgeColor}`}>
                  {feat.badge}
                </span>
              </div>
            </GlassCard>
          </ParallaxReveal>
        ))}
      </div>
    </section>
  );
}
