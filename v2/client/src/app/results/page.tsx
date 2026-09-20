"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CosmicCanvas from "@/components/canvas/CosmicCanvas";
import Navbar from "@/components/layout/Navbar";
import ParallaxReveal from "@/components/ui/ParallaxReveal";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function QuizResultsContent() {
  const router = useRouter();
  const [filterReview, setFilterReview] = useState<"all" | "correct" | "incorrect">("all");
  const [showShareModal, setShowShareModal] = useState(false);

  return (
    <div className="min-h-screen text-on-surface font-body-md selection:bg-primary selection:text-on-primary relative overflow-x-hidden antialiased">
      {/* Universal Cosmic Starfield Canvas */}
      <CosmicCanvas />

      {/* Universal Top Navbar */}
      <Navbar />

      {/* Main Canvas Content */}
      <main className="relative z-10 max-w-max-width-canvas mx-auto px-4 sm:px-8 pt-28 pb-20 space-y-8">
        {/* Hero Result & XP Banner Section */}
        <ParallaxReveal direction="up" distance={25} duration={750}>
          <section className="rounded-2xl p-6 sm:p-8 relative overflow-hidden bg-surface-container-low/80 backdrop-blur-2xl border border-outline-variant/30 shadow-2xl">
          <div className="absolute -right-16 -top-16 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-tertiary/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            {/* Rank & Headline */}
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary/15 border border-tertiary/40 text-xs">
                <span className="material-symbols-outlined text-tertiary text-sm">
                  military_tech
                </span>
                <span className="font-label-code text-tertiary font-bold tracking-wide">
                  TOP 4% • COSMIC GRANDMASTER TIER
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-headline-xl text-on-surface font-bold tracking-tight flex flex-wrap items-center gap-2">
                <span>Rank #2</span>
                <span className="text-on-surface-variant font-body-lg text-lg font-normal">
                  of 48 Participants
                </span>
                <span className="px-2 py-0.5 text-xs rounded bg-surface-container-high border border-outline-variant/40 text-primary-fixed font-label-code font-bold">
                  Grade A+
                </span>
              </h1>

              <p className="text-xs sm:text-sm font-body-md text-on-surface-variant leading-relaxed">
                Exceptional mastery demonstrated across quantum state mechanics. You outpaced 96% of cohort cadets in entanglement telemetry.
              </p>
            </div>

            {/* Metric Cluster */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto">
              <div className="bg-surface-container-high/60 border border-outline-variant/30 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                <span className="font-label-code text-[10px] text-on-surface-variant uppercase tracking-wider">
                  Final XP
                </span>
                <span className="font-stat-counter text-xl sm:text-2xl text-primary font-bold">
                  2,100
                </span>
                <span className="font-label-code text-[10px] text-tertiary">/ 2,250 Max</span>
              </div>

              <div className="bg-surface-container-high/60 border border-outline-variant/30 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                <span className="font-label-code text-[10px] text-on-surface-variant uppercase tracking-wider">
                  Accuracy
                </span>
                <span className="font-stat-counter text-xl sm:text-2xl text-tertiary font-bold">
                  93.3%
                </span>
                <span className="font-label-code text-[10px] text-on-surface-variant">
                  14/15 Correct
                </span>
              </div>

              <div className="bg-surface-container-high/60 border border-outline-variant/30 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                <span className="font-label-code text-[10px] text-on-surface-variant uppercase tracking-wider">
                  Total Time
                </span>
                <span className="font-stat-counter text-xl sm:text-2xl text-on-surface font-bold">
                  11m 42s
                </span>
                <span className="font-label-code text-[10px] text-on-surface-variant">
                  Avg 46.8s/Q
                </span>
              </div>

              <div className="bg-surface-container-high/60 border border-outline-variant/30 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                <span className="font-label-code text-[10px] text-on-surface-variant uppercase tracking-wider">
                  Multiplier
                </span>
                <span className="font-stat-counter text-xl sm:text-2xl text-secondary font-bold">
                  1.8x
                </span>
                <span className="font-label-code text-[10px] text-primary">Streak Surge</span>
              </div>
            </div>
          </div>

          {/* Quick Nav Anchor Pills */}
          <div className="mt-6 pt-4 border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-3 text-xs font-headline-sm">
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href="#leaderboard-section"
                className="px-3 py-1 rounded-full bg-surface-container-highest/60 hover:bg-primary-container/30 hover:text-primary transition-all flex items-center gap-1.5 text-on-surface"
              >
                <span className="material-symbols-outlined text-sm">trophy</span>
                <span>Fleet Leaderboard</span>
              </a>
              <a
                href="#analytics-grid"
                className="px-3 py-1 rounded-full bg-surface-container-highest/60 hover:bg-primary-container/30 hover:text-primary transition-all flex items-center gap-1.5 text-on-surface"
              >
                <span className="material-symbols-outlined text-sm">analytics</span>
                <span>Telemetry Analytics</span>
              </a>
              <a
                href="#review-section"
                className="px-3 py-1 rounded-full bg-surface-container-highest/60 hover:bg-primary-container/30 hover:text-primary transition-all flex items-center gap-1.5 text-on-surface"
              >
                <span className="material-symbols-outlined text-sm">fact_check</span>
                <span>Question Solutions</span>
              </a>
            </div>

            <div className="flex items-center gap-2 font-label-code">
              <Link
                href="/create"
                className="px-3 py-1.5 rounded-lg bg-primary-container hover:bg-primary-container/90 text-white font-semibold flex items-center gap-1 shadow-sm border border-white/10 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>Create New Quiz</span>
              </Link>
            </div>
          </div>
        </section>
      </ParallaxReveal>

      {/* Real-Time Cosmic Leaderboard Section */}
      <ParallaxReveal direction="up" distance={30} delay={100} duration={800}>
        <section className="space-y-4" id="leaderboard-section">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-xl">
                  emoji_events
                </span>
                <h2 className="font-headline-lg text-xl sm:text-2xl text-on-surface font-semibold tracking-tight">
                  Cosmic Fleet Leaderboard
                </h2>
              </div>
              <p className="text-xs text-on-surface-variant">
                Verified results for session QC-9804 • Quantum Computing Principles
              </p>
            </div>

            <div className="inline-flex p-1 rounded-full bg-surface-container-high border border-outline-variant/30 text-xs font-headline-sm">
              <button className="px-3 py-0.5 rounded-full font-semibold bg-primary text-on-primary shadow-sm">
                All Cadets (48)
              </button>
              <button className="px-3 py-0.5 rounded-full text-on-surface-variant hover:text-on-surface">
                Cohort Alpha (12)
              </button>
            </div>
          </div>

          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-5">
            {/* 2nd Place: Alex Rivera (CurrentUser) */}
            <div className="order-2 md:order-1 rounded-2xl p-5 border border-primary/50 relative bg-gradient-to-b from-primary-container/20 to-surface-container-low/90 shadow-lg shadow-primary/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary text-on-primary text-[11px] font-label-code font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                <span className="material-symbols-outlined text-xs">star</span>
                <span>2nd • YOU</span>
              </div>
              <div className="flex flex-col items-center text-center mt-2">
                <div className="w-14 h-14 rounded-full border-2 border-primary p-0.5 mb-2 relative bg-surface-container flex items-center justify-center font-bold text-lg text-primary">
                  AR
                  <span className="absolute bottom-0 right-0 bg-primary text-on-primary text-[10px] font-label-code font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    2
                  </span>
                </div>
                <h4 className="font-headline-sm text-base text-on-surface font-bold">
                  Alex Rivera
                </h4>
                <span className="font-label-code text-xs text-primary-fixed">
                  @arivera • Cadet Cohort Alpha
                </span>
                <div className="mt-3 w-full bg-surface-container-highest/50 rounded-xl p-2 flex justify-around text-center text-xs">
                  <div>
                    <span className="block text-[10px] font-label-code text-on-surface-variant">XP</span>
                    <span className="font-stat-counter text-sm text-primary font-bold">2,100</span>
                  </div>
                  <div className="w-[1px] bg-outline-variant/30" />
                  <div>
                    <span className="block text-[10px] font-label-code text-on-surface-variant">ACC</span>
                    <span className="font-stat-counter text-sm text-tertiary font-bold">93.3%</span>
                  </div>
                  <div className="w-[1px] bg-outline-variant/30" />
                  <div>
                    <span className="block text-[10px] font-label-code text-on-surface-variant">TIME</span>
                    <span className="font-stat-counter text-sm text-on-surface font-bold">11m 42s</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 1st Place: Elena Vance (Champion) */}
            <div className="order-1 md:order-2 rounded-2xl p-6 border-2 border-tertiary/60 relative transform md:-translate-y-2 bg-gradient-to-b from-tertiary-container/30 via-surface-container/90 to-surface-container-lowest shadow-xl shadow-tertiary/20">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-tertiary text-on-tertiary text-[11px] font-label-code font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg">
                <span className="material-symbols-outlined text-sm">military_tech</span>
                <span>1st • GRAND CHAMPION</span>
              </div>
              <div className="flex flex-col items-center text-center mt-2">
                <div className="w-16 h-16 rounded-full border-2 border-tertiary p-0.5 mb-2 relative ring-4 ring-tertiary/20 bg-surface-container flex items-center justify-center font-bold text-xl text-tertiary">
                  EV
                  <span className="absolute bottom-0 right-0 bg-tertiary text-on-tertiary text-[10px] font-label-code font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    1
                  </span>
                </div>
                <h4 className="font-headline-sm text-lg text-on-surface font-extrabold">
                  Elena Vance
                </h4>
                <span className="font-label-code text-xs text-tertiary font-medium">
                  @avance • MIT Q-Lab Affiliate
                </span>
                <div className="mt-3 w-full bg-surface-container-highest/60 rounded-xl p-2.5 flex justify-around text-center border border-tertiary/30 text-xs">
                  <div>
                    <span className="block text-[10px] font-label-code text-on-surface-variant">TOTAL XP</span>
                    <span className="font-stat-counter text-base text-tertiary font-bold">2,210</span>
                  </div>
                  <div className="w-[1px] bg-outline-variant/30" />
                  <div>
                    <span className="block text-[10px] font-label-code text-on-surface-variant">ACCURACY</span>
                    <span className="font-stat-counter text-base text-tertiary font-bold">100%</span>
                  </div>
                  <div className="w-[1px] bg-outline-variant/30" />
                  <div>
                    <span className="block text-[10px] font-label-code text-on-surface-variant">TIME</span>
                    <span className="font-stat-counter text-base text-on-surface font-bold">10m 18s</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3rd Place: Marcus Chen */}
            <div className="order-3 rounded-2xl p-5 border border-secondary/40 relative bg-gradient-to-b from-secondary-container/20 to-surface-container-low/90 shadow-lg">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-label-code font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">workspace_premium</span>
                <span>3rd Place</span>
              </div>
              <div className="flex flex-col items-center text-center mt-2">
                <div className="w-14 h-14 rounded-full border-2 border-secondary p-0.5 mb-2 relative bg-surface-container flex items-center justify-center font-bold text-lg text-secondary">
                  MC
                  <span className="absolute bottom-0 right-0 bg-secondary-container text-on-secondary-container text-[10px] font-label-code font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    3
                  </span>
                </div>
                <h4 className="font-headline-sm text-base text-on-surface font-bold">
                  Marcus Chen
                </h4>
                <span className="font-label-code text-xs text-secondary-fixed">
                  @mchen • ETH Zurich Fellow
                </span>
                <div className="mt-3 w-full bg-surface-container-highest/50 rounded-xl p-2 flex justify-around text-center text-xs">
                  <div>
                    <span className="block text-[10px] font-label-code text-on-surface-variant">XP</span>
                    <span className="font-stat-counter text-sm text-secondary font-bold">2,040</span>
                  </div>
                  <div className="w-[1px] bg-outline-variant/30" />
                  <div>
                    <span className="block text-[10px] font-label-code text-on-surface-variant">ACC</span>
                    <span className="font-stat-counter text-sm text-tertiary font-bold">93.3%</span>
                  </div>
                  <div className="w-[1px] bg-outline-variant/30" />
                  <div>
                    <span className="block text-[10px] font-label-code text-on-surface-variant">TIME</span>
                    <span className="font-stat-counter text-sm text-on-surface font-bold">12m 05s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Standings Table */}
          <div className="rounded-2xl overflow-hidden border border-outline-variant/30 bg-surface-container-low/80 backdrop-blur-xl shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-outline-variant/30 bg-surface-container-highest/40 text-on-surface-variant font-label-code text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Cadet</th>
                    <th className="py-3 px-4">Affiliation / Status</th>
                    <th className="py-3 px-4 text-right">Accuracy</th>
                    <th className="py-3 px-4 text-right">Avg Response</th>
                    <th className="py-3 px-4 text-right">Streak XP</th>
                    <th className="py-3 px-4 text-right">Total XP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 font-body-md">
                  <tr className="hover:bg-surface-container-high/40 transition-colors">
                    <td className="py-3 px-4 font-label-code font-bold text-tertiary">#01</td>
                    <td className="py-3 px-4 font-semibold text-on-surface">Elena Vance (@avance)</td>
                    <td className="py-3 px-4 text-on-surface-variant text-[11px]">MIT Quantum Lab</td>
                    <td className="py-3 px-4 text-right font-label-code text-tertiary font-semibold">100%</td>
                    <td className="py-3 px-4 text-right font-label-code text-on-surface">41.2s</td>
                    <td className="py-3 px-4 text-right font-label-code text-primary">+260 XP</td>
                    <td className="py-3 px-4 text-right font-stat-counter font-bold text-on-surface">2,210</td>
                  </tr>
                  <tr className="bg-primary-container/15 hover:bg-primary-container/25 transition-colors border-l-4 border-l-primary">
                    <td className="py-3 px-4 font-label-code font-bold text-primary">#02</td>
                    <td className="py-3 px-4 font-bold text-on-surface flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-primary text-on-primary text-[10px] font-label-code font-bold">YOU</span>
                      <span>Alex Rivera (@arivera)</span>
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant text-[11px]">Cadet Cohort Alpha</td>
                    <td className="py-3 px-4 text-right font-label-code text-tertiary font-semibold">93.3%</td>
                    <td className="py-3 px-4 text-right font-label-code text-on-surface">46.8s</td>
                    <td className="py-3 px-4 text-right font-label-code text-primary">+150 XP</td>
                    <td className="py-3 px-4 text-right font-stat-counter font-bold text-primary">2,100</td>
                  </tr>
                  <tr className="hover:bg-surface-container-high/40 transition-colors">
                    <td className="py-3 px-4 font-label-code font-bold text-secondary">#03</td>
                    <td className="py-3 px-4 font-semibold text-on-surface">Marcus Chen (@mchen)</td>
                    <td className="py-3 px-4 text-on-surface-variant text-[11px]">ETH Zurich</td>
                    <td className="py-3 px-4 text-right font-label-code text-tertiary font-semibold">93.3%</td>
                    <td className="py-3 px-4 text-right font-label-code text-on-surface">48.3s</td>
                    <td className="py-3 px-4 text-right font-label-code text-primary">+90 XP</td>
                    <td className="py-3 px-4 text-right font-stat-counter font-bold text-on-surface">2,040</td>
                  </tr>
                  <tr className="hover:bg-surface-container-high/40 transition-colors">
                    <td className="py-3 px-4 font-label-code font-bold text-on-surface-variant">#04</td>
                    <td className="py-3 px-4 text-on-surface">Aria Starkova (@astark)</td>
                    <td className="py-3 px-4 text-on-surface-variant text-[11px]">Imperial College London</td>
                    <td className="py-3 px-4 text-right font-label-code text-tertiary font-semibold">86.7%</td>
                    <td className="py-3 px-4 text-right font-label-code text-on-surface">39.1s</td>
                    <td className="py-3 px-4 text-right font-label-code text-primary">+120 XP</td>
                    <td className="py-3 px-4 text-right font-stat-counter font-bold text-on-surface">1,970</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </ParallaxReveal>

      {/* Telemetry & Deep Diagnostics Section */}
      <ParallaxReveal direction="up" distance={25} delay={100} duration={750}>
        <section className="space-y-4" id="analytics-grid">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary text-xl">
              monitoring
            </span>
            <h2 className="font-headline-lg text-xl sm:text-2xl text-on-surface font-semibold tracking-tight">
              Telemetry & Deep Diagnostics
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sub-Discipline Mastery */}
            <div className="rounded-xl p-5 bg-surface-container-low/80 border border-outline-variant/30 space-y-3">
              <h3 className="font-headline-sm text-sm font-semibold text-on-surface">
                Sub-Discipline Mastery
              </h3>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Quantum Gates & Unitary Ops</span>
                    <span className="text-tertiary font-label-code font-bold">100% (3/3)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-tertiary w-full rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Entanglement & Bell States</span>
                    <span className="text-tertiary font-label-code font-bold">100% (3/3)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-tertiary w-full rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Shor&apos;s &amp; Grover&apos;s Algorithms</span>
                    <span className="text-error font-label-code font-bold">66% (2/3)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-error to-primary w-[66%] rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Environmental Decoherence (T1/T2)</span>
                    <span className="text-tertiary font-label-code font-bold">100% (3/3)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-tertiary w-full rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Velocity vs Accuracy Radar Summary */}
            <div className="rounded-xl p-5 bg-surface-container-low/80 border border-outline-variant/30 flex flex-col justify-between">
              <div>
                <h3 className="font-headline-sm text-sm font-semibold text-on-surface mb-1">
                  Speed vs. Accuracy Quadrant
                </h3>
                <p className="text-xs text-on-surface-variant mb-4">
                  Cadet positioning across 48 participants: Elite Maestro zone.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-highest/40 border border-outline-variant/20 flex flex-col items-center justify-center text-center space-y-2">
                <span className="font-label-code text-xs px-3 py-1 rounded-full bg-tertiary/20 text-tertiary border border-tertiary/40 font-bold">
                  96th Velocity / 93rd Accuracy
                </span>
                <p className="text-xs text-on-surface-variant max-w-sm">
                  Your mean latency was 46.8 seconds per question, with instant convergence on state vector math.
                </p>
              </div>

              <div className="pt-3 flex justify-between text-[11px] font-label-code text-on-surface-variant">
                <span>Model: Tactile-QC-v4.2</span>
                <span className="text-primary">Reliability: High (99.8%)</span>
              </div>
            </div>
          </div>
        </section>
      </ParallaxReveal>

      {/* Question Solutions Breakdown */}
      <ParallaxReveal direction="up" distance={25} delay={100} duration={750}>
        <section className="space-y-4" id="review-section">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-tertiary text-xl">
                  fact_check
                </span>
                <h2 className="font-headline-lg text-xl sm:text-2xl text-on-surface font-semibold tracking-tight">
                  Full Question Breakdown &amp; Solutions
                </h2>
              </div>
              <p className="text-xs text-on-surface-variant">
                Review verified solutions, mathematical derivations, and pedagogical feedback
              </p>
            </div>

            <div className="flex items-center gap-1.5 font-headline-sm text-xs">
              <button
                onClick={() => setFilterReview("all")}
                className={`px-3 py-1 rounded-full transition-all ${
                  filterReview === "all"
                    ? "bg-primary text-on-primary font-semibold"
                    : "bg-surface-container-high text-on-surface hover:text-primary"
                }`}
              >
                All (5)
              </button>
              <button
                onClick={() => setFilterReview("correct")}
                className={`px-3 py-1 rounded-full transition-all ${
                  filterReview === "correct"
                    ? "bg-emerald-600 text-white font-semibold"
                    : "bg-surface-container-high text-on-surface hover:text-primary"
                }`}
              >
                Correct (4)
              </button>
              <button
                onClick={() => setFilterReview("incorrect")}
                className={`px-3 py-1 rounded-full transition-all ${
                  filterReview === "incorrect"
                    ? "bg-error text-on-error font-semibold"
                    : "bg-surface-container-high text-on-surface hover:text-primary"
                }`}
              >
                Incorrect (1)
              </button>
            </div>
          </div>

          {/* Solution Cards */}
          <div className="space-y-3">
            {/* Question 4 Review Card */}
            {(filterReview === "all" || filterReview === "correct") && (
              <div className="rounded-2xl p-5 bg-surface-container-low/80 border border-emerald-500/40 space-y-3 shadow-md">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <span className="font-label-code font-bold text-primary">#04</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-label-code font-bold">
                      CORRECT (+150 XP)
                    </span>
                    <span className="text-on-surface-variant hidden sm:inline">
                      Time: 28s
                    </span>
                  </div>
                  <span className="font-label-code text-[11px] text-tertiary">
                    QUANTUM MECHANICS & SUPERPOSITION
                  </span>
                </div>

                <p className="text-sm font-headline-sm text-on-surface font-medium">
                  In quantum circuit design, what occurs to a qubit in an equal superposition state (|0⟩ + |1⟩)/√2 when measured along the standard computational basis?
                </p>

                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300">
                  <span className="font-bold font-label-code block mb-1">
                    Your Response: [B] It collapses into either |0⟩ or |1⟩ with equal 50% probability, permanently destroying superposition.
                  </span>
                  <p className="text-on-surface-variant text-[11px] mt-1 leading-relaxed">
                    Derivation: Measurement maps continuous state onto orthogonal eigenvectors with probability P(x) = |⟨x|ψ⟩|² = |1/√2|² = 0.5.
                  </p>
                </div>
              </div>
            )}

            {/* Question 5 Review Card (Sample Incorrect) */}
            {(filterReview === "all" || filterReview === "incorrect") && (
              <div className="rounded-2xl p-5 bg-surface-container-low/80 border border-error/40 space-y-3 shadow-md">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <span className="font-label-code font-bold text-primary">#05</span>
                    <span className="px-2 py-0.5 rounded-full bg-error-container/30 text-error border border-error/40 font-label-code font-bold">
                      INCORRECT (0 XP)
                    </span>
                    <span className="text-on-surface-variant hidden sm:inline">
                      Time: 112s
                    </span>
                  </div>
                  <span className="font-label-code text-[11px] text-outline">
                    SHOR&apos;S ALGORITHM ORDER FINDING
                  </span>
                </div>

                <p className="text-sm font-headline-sm text-on-surface font-medium">
                  In Shor&apos;s algorithm, which operation extracts the periodic eigenvalue phase θ from modular exponentiation?
                </p>

                <div className="p-3 rounded-xl bg-error-container/20 border border-error/30 text-xs text-error space-y-1">
                  <span className="font-bold font-label-code block">
                    Your Answer: [C] Grover Diffusion Inversion Operator
                  </span>
                  <span className="font-bold text-emerald-400 font-label-code block">
                    Correct Answer: [A] Quantum Phase Estimation (Inverse QFT)
                  </span>
                  <p className="text-on-surface-variant text-[11px] mt-1 leading-relaxed">
                    Pedagogical Note: While Grover diffusion amplifies probability amplitudes in search problems, Shor&apos;s algorithm employs the Quantum Fourier Transform (QFT⁻¹) to resolve the periodicity of modular exponentiation.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </ParallaxReveal>
    </main>

      {/* Share Score Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-surface-container-low border border-primary/40 rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <span className="material-symbols-outlined text-4xl text-primary">emoji_events</span>
            <h3 className="font-headline-sm text-base text-on-surface font-bold">
              Share Your Grandmaster Score
            </h3>
            <p className="text-xs text-on-surface-variant">
              Rank #2 • 2,100 XP • 93.3% Accuracy on Quantum Computing Principles
            </p>
            <div className="p-3 rounded-lg bg-surface-container-high text-xs font-label-code text-primary break-all">
              https://quizzcraft.app/results/QC-9804-QBIT?cadet=alex
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText("https://quizzcraft.app/results/QC-9804-QBIT?cadet=alex");
                alert("Score URL copied to clipboard!");
                setShowShareModal(false);
              }}
              className="w-full py-2.5 rounded-xl bg-primary-container hover:bg-primary-container/90 text-white font-headline-sm text-xs font-semibold shadow-sm border border-white/10 active:scale-95 transition-all cursor-pointer"
            >
              Copy Share Link
            </button>
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full py-1.5 text-on-surface-variant hover:text-on-surface text-xs font-label-code"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full bg-surface-container-lowest/80 backdrop-blur-md border-t border-outline-variant/20 py-6 px-6 relative z-10 text-xs font-label-code text-on-surface-variant">
        <div className="max-w-max-width-canvas mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-primary font-bold">QuizzCraft.app</span>
            <span>© 2026 QuizzCraft</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/quiz" className="hover:text-primary transition-colors">
              Retake Quiz
            </Link>
            <Link href="/create" className="hover:text-primary transition-colors">
              Create Another Quiz
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function QuizResultsPage() {
  return (
    <ProtectedRoute>
      <QuizResultsContent />
    </ProtectedRoute>
  );
}
