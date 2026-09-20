import React from "react";
import Link from "next/link";
import ChapterBadge from "../ui/ChapterBadge";
import GlassCard from "../ui/GlassCard";
import ParallaxReveal from "../ui/ParallaxReveal";

interface PersonaItem {
  icon: string;
  iconBg: string;
  iconColor: string;
  badge: string;
  badgeColor: string;
  title: string;
  description: string;
  href: string;
}

const personas: PersonaItem[] = [
  {
    icon: "school",
    iconBg: "bg-primary-container/20 border-primary/30 text-primary",
    iconColor: "text-primary",
    badge: "ACADEMIA & SCHOOLS",
    badgeColor: "text-primary",
    title: "For Educators",
    description:
      "Transform lesson slides and readings into interactive weekly review games. Zero grading friction and instant student participation.",
    href: "/create",
  },
  {
    icon: "podcasts",
    iconBg: "bg-tertiary-container/20 border-tertiary/30 text-tertiary",
    iconColor: "text-tertiary",
    badge: "CREATORS & COACHES",
    badgeColor: "text-tertiary",
    title: "For Content Creators",
    description:
      "Turn tutorials, newsletters, and course materials into interactive trivia for your audience to boost course completion rates.",
    href: "/create",
  },
  {
    icon: "domain",
    iconBg: "bg-secondary-container/20 border-secondary/30 text-secondary",
    iconColor: "text-secondary",
    badge: "TEAMS & ENTERPRISE",
    badgeColor: "text-secondary",
    title: "For Team Leads",
    description:
      "Make onboarding and compliance training engaging with competitive live sessions, team streaks, and real-time completion tracking.",
    href: "/create",
  },
];

export default function GuildsSection() {
  return (
    <section
      className="py-20 px-gutter-mobile md:px-gutter-desktop max-w-max-width-canvas mx-auto relative z-10"
      id="ch-04"
    >
      <ParallaxReveal direction="up" distance={30} duration={750}>
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12">
          <ChapterBadge
            title="FLEXIBLE WORKSPACES"
            variant="primary"
          />
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-white font-headline-xl font-bold">
            Tailored For Any Classroom or Team
          </h2>
          <p className="text-body-md text-on-surface-variant max-w-xl mt-2 text-sm sm:text-base">
            Whether you teach students, coach cohorts, or train colleagues, QuizzCraft fits your workflow.
          </p>
        </div>
      </ParallaxReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {personas.map((item, idx) => (
          <ParallaxReveal
            key={item.title}
            direction="up"
            distance={35}
            delay={idx * 130}
            duration={800}
            parallaxSpeed={0.015}
            className="h-full"
          >
            <GlassCard
              hoverEffect
              className="rounded-2xl p-6 sm:p-7 border-outline-variant/30 flex flex-col justify-between group h-full transition-all duration-300 hover:border-primary/40 hover:-translate-y-1.5"
            >
              <div className="space-y-3">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center border group-hover:scale-110 transition-transform ${item.iconBg}`}
                >
                  <span className="material-symbols-outlined text-2xl">
                    {item.icon}
                  </span>
                </div>
                <div>
                  <span className={`font-label-code text-xs font-semibold ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                  <h3 className="font-headline-lg text-white text-lg sm:text-xl font-bold mt-1">
                    {item.title}
                  </h3>
                </div>
                <p className="text-body-md text-on-surface-variant text-xs sm:text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-outline-variant/20">
                <Link
                  href={item.href}
                  className={`text-xs flex items-center gap-1 font-semibold group-hover:translate-x-1.5 transition-transform ${item.badgeColor}`}
                >
                  <span>Get Started</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </GlassCard>
          </ParallaxReveal>
        ))}
      </div>
    </section>
  );
}
