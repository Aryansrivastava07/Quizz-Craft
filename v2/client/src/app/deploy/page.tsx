"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CosmicCanvas from "@/components/canvas/CosmicCanvas";
import Navbar from "@/components/layout/Navbar";
import ParallaxReveal from "@/components/ui/ParallaxReveal";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function DeployScheduleContent() {
  const router = useRouter();
  const [copiedId, setCopiedId] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const [antiCheat, setAntiCheat] = useState(true);
  const [fullScreenLock, setFullScreenLock] = useState(true);
  const [shuffleChoices, setShuffleChoices] = useState(true);
  const [allowRetries, setAllowRetries] = useState(false);

  const quizId = "QC-9804-QBIT";
  const pin = "884-219";

  const handleCopyId = () => {
    navigator.clipboard.writeText(quizId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyUrl = () => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/join` : "https://quizzcraft.app/join";
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="min-h-screen text-on-surface font-body-md selection:bg-primary selection:text-on-primary antialiased relative flex flex-col justify-between overflow-x-hidden">
      {/* Universal Cosmic Starfield Canvas */}
      <CosmicCanvas />

      {/* Universal Top Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="relative z-10 w-full max-w-max-width-canvas mx-auto px-4 sm:px-8 pt-28 pb-16 flex-1 flex flex-col gap-6">
        {/* Top Hero Banner with Holographic Sphere Thumbnail (Screen 6 Asset) */}
        <ParallaxReveal direction="up" distance={25} duration={700}>
          <section className="relative w-full rounded-2xl p-6 sm:p-8 overflow-hidden bg-surface-container-low/75 backdrop-blur-2xl border border-outline-variant/30 shadow-2xl">
          <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-primary-container/20 blur-[100px] pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-tertiary-container/15 blur-[90px] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high border border-outline-variant/40 font-label-code text-xs text-tertiary">
                  <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
                  Validated & Ready to Deploy
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-container/40 text-secondary font-label-code text-xs border border-secondary-container/60">
                  BUILD: v3.4.1
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-headline-xl text-on-surface tracking-tight font-extrabold">
                Quantum Computing Principles
              </h1>

              <p className="text-on-surface-variant font-body-md text-xs sm:text-sm max-w-2xl leading-relaxed">
                15 Questions • 2,250 Potential XP • Dynamic Adaptive Scoring • Quantum Superposition & Telemetry. Select your deployment protocol below.
              </p>

              <div className="pt-1 flex flex-wrap items-center gap-3 text-on-surface-variant font-label-code text-xs">
                <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/30">
                  <span className="material-symbols-outlined text-base text-primary">timer</span>
                  <span>Avg. Duration: 12 Mins</span>
                </div>
                <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/30">
                  <span className="material-symbols-outlined text-base text-tertiary">psychology</span>
                  <span>AI Engine: Tactile-Q-1.8</span>
                </div>
                <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/30">
                  <span className="material-symbols-outlined text-base text-secondary">verified_user</span>
                  <span>Integrity Hash: 9F4C-QBIT</span>
                </div>
              </div>
            </div>

            {/* 3D Holographic Sphere Thumbnail */}
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex-shrink-0 rounded-2xl overflow-hidden p-1.5 bg-gradient-to-b from-primary/30 via-outline-variant/20 to-tertiary/20 shadow-2xl">
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-surface-container-lowest">
                <img
                  src="/stitch/screen-6-cosmic-portal-3d.png"
                  alt="Holographic Quantum Sphere representing quiz telemetry engine"
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[10px] font-label-code text-primary-fixed-dim bg-surface-container-low/80 backdrop-blur-sm px-2 py-1 rounded">
                  <span>ORBIT ENGINE</span>
                  <span className="text-tertiary font-bold">ONLINE</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ParallaxReveal>

      {/* Universal Quiz ID & Quick Share Global Bar */}
      <ParallaxReveal direction="up" distance={25} delay={80} duration={700}>
        <section className="rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 border border-primary-container/30 bg-surface-container-low/90 backdrop-blur-xl shadow-lg">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-11 h-11 rounded-xl bg-primary-container/20 flex items-center justify-center border border-primary/30 text-primary shrink-0">
              <span className="material-symbols-outlined text-2xl">fingerprint</span>
            </div>
            <div>
              <div className="text-on-surface-variant font-label-code text-[11px] uppercase tracking-wider">
                Assigned Universal Quiz ID
              </div>
              <div className="flex items-center gap-2">
                <span className="font-stat-counter text-base sm:text-lg text-primary tracking-widest font-bold">
                  {quizId}
                </span>
                <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-label-code font-bold uppercase">
                  Active
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end text-xs font-label-code">
            <button
              onClick={handleCopyId}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-high border border-outline-variant/40 hover:border-primary text-on-surface transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-sm text-primary">content_copy</span>
              <span>{copiedId ? "Copied ID!" : "Copy ID"}</span>
            </button>
            <button
              onClick={handleCopyUrl}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-high border border-outline-variant/40 hover:border-tertiary text-on-surface transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-sm text-tertiary">link</span>
              <span>{copiedUrl ? "Copied Join Link!" : "Copy Direct Join URL"}</span>
            </button>
            <button
              onClick={() => setShowQrModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-high border border-outline-variant/40 hover:border-secondary text-on-surface transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-sm text-secondary">qr_code_2</span>
              <span>QR Portal</span>
            </button>
          </div>
        </section>
      </ParallaxReveal>

      {/* Core 3 Deployment Cards */}
      <ParallaxReveal direction="up" distance={30} delay={140} duration={800}>
        <section className="space-y-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
            <div>
              <h2 className="text-xl sm:text-2xl font-headline-lg text-on-surface font-semibold">
                Select Deployment Protocol
              </h2>
              <p className="text-on-surface-variant text-xs font-body-sm">
                Select synchronous live lobby, scheduled event, or asynchronous self-paced repository.
              </p>
            </div>
            <span className="text-on-surface-variant font-label-code text-xs mt-1 md:mt-0 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-primary">hub</span>
              MULTI-VECTOR ROUTING
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Card 1: Launch Real-Time Live Quiz */}
            <div className="rounded-2xl p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden border-2 border-primary/40 bg-gradient-to-b from-surface-container-low/95 to-surface-container-lowest shadow-xl">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-container to-secondary" />
              <div className="absolute -right-16 -top-16 w-36 h-36 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container/30 text-primary-fixed border border-primary/40 font-label-code text-xs uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                    Live Host
                  </span>
                  <span className="material-symbols-outlined text-primary text-2xl">sensors</span>
                </div>

                <h3 className="text-base sm:text-lg font-headline-sm text-on-surface font-semibold mb-2">
                  Launch Real-Time Live Quiz
                </h3>
                <p className="text-on-surface-variant text-xs font-body-sm mb-4 leading-relaxed">
                  Synchronous arena battle with real-time dynamic leaderboards, presenter-controlled pacing, and high-energy podium telemetry.
                </p>

                <ul className="space-y-2 mb-6 text-on-surface-variant text-xs">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-primary">check_circle</span>
                    <span>Sub-50ms synchronized telemetry</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-primary">check_circle</span>
                    <span>Live spatial avatar podium</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-primary">check_circle</span>
                    <span>Automated room countdown & haptics</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3 pt-3 border-t border-outline-variant/30">
                <div className="flex items-center justify-between text-xs font-label-code text-on-surface-variant bg-surface-container-high/60 px-3 py-2 rounded-lg border border-outline-variant/30">
                  <span>Lobby Preview:</span>
                  <span className="text-primary font-bold tracking-wider">PIN: {pin}</span>
                </div>
                <button
                  onClick={() => router.push("/quiz")}
                  className="w-full py-3 px-4 rounded-xl bg-primary-container hover:bg-primary-container/90 text-white font-headline-sm text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-sm border border-white/10 active:scale-95 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">play_arrow</span>
                  <span>Start Live Room Now 🚀</span>
                </button>
              </div>
            </div>

            {/* Card 2: Schedule for Later */}
            <div className="rounded-2xl p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden border border-outline-variant/40 bg-gradient-to-b from-surface-container-low/70 to-surface-container-lowest hover:border-secondary/60 transition-all shadow-xl">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary-container via-secondary to-primary-fixed-dim opacity-70" />

              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-secondary border border-secondary/40 font-label-code text-xs uppercase tracking-wider">
                    <span className="material-symbols-outlined text-xs">event</span>
                    Scheduled
                  </span>
                  <span className="material-symbols-outlined text-secondary text-2xl">alarm</span>
                </div>

                <h3 className="text-base sm:text-lg font-headline-sm text-on-surface font-semibold mb-2">
                  Schedule for Later
                </h3>
                <p className="text-on-surface-variant text-xs font-body-sm mb-4 leading-relaxed">
                  Automated timed release. Dispatches synchronous invitations to Google Calendar, Canvas LMS, and Discord webhooks with auto-start.
                </p>

                <div className="space-y-2.5 mb-4 bg-surface-container-lowest/60 p-3 rounded-xl border border-outline-variant/30 text-xs">
                  <div>
                    <label className="block text-[11px] font-label-code text-on-surface-variant mb-1">
                      Target Launch Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      defaultValue="2026-09-15T14:00"
                      className="w-full bg-surface-container-high text-on-surface border border-outline-variant/50 rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-secondary outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-label-code text-on-surface-variant mb-1">
                        Duration Window
                      </label>
                      <select className="w-full bg-surface-container-high text-on-surface border border-outline-variant/50 rounded-lg px-2 py-1 text-xs outline-none">
                        <option>45 Minutes</option>
                        <option>90 Minutes</option>
                        <option>24 Hours</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-label-code text-on-surface-variant mb-1">
                        Timezone
                      </label>
                      <select className="w-full bg-surface-container-high text-on-surface border border-outline-variant/50 rounded-lg px-2 py-1 text-xs outline-none">
                        <option>UTC-5 (EST)</option>
                        <option>UTC+0 (GMT)</option>
                        <option>UTC+5:30 (IST)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-outline-variant/30">
                <button
                  onClick={() => alert(`Quiz scheduled for 2026-09-15! Notification webhooks activated.`)}
                  className="w-full py-3 px-4 rounded-xl bg-surface-container-high hover:bg-secondary-container hover:text-white text-on-surface font-headline-sm text-xs sm:text-sm border border-outline-variant/40 hover:border-secondary transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <span className="material-symbols-outlined text-base text-secondary">calendar_month</span>
                  <span>Confirm Schedule 📅</span>
                </button>
              </div>
            </div>

            {/* Card 3: Anytime Mode / Self-Paced Access */}
            <div className="rounded-2xl p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden border border-tertiary/40 bg-gradient-to-b from-surface-container-low/80 to-surface-container-lowest shadow-xl">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-tertiary-container via-tertiary to-primary" />
              <div className="absolute -right-16 -top-16 w-36 h-36 rounded-full bg-tertiary/15 blur-3xl pointer-events-none" />

              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-container/30 text-tertiary-fixed border border-tertiary/40 font-label-code text-xs uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-tertiary" />
                    Async • Open Access
                  </span>
                  <span className="material-symbols-outlined text-tertiary text-2xl">all_inclusive</span>
                </div>

                <h3 className="text-base sm:text-lg font-headline-sm text-on-surface font-semibold mb-2">
                  Anytime Mode / Self-Paced
                </h3>
                <p className="text-on-surface-variant text-xs font-body-sm mb-4 leading-relaxed">
                  Learners engage whenever they want using the Universal Quiz ID. Ideal for homework, certification, and asynchronous learning.
                </p>

                <div className="space-y-2 mb-4 text-on-surface-variant text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-high/40 border border-outline-variant/30">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-tertiary text-base">replay</span>
                      <span>Attempt Limit</span>
                    </div>
                    <span className="font-label-code text-tertiary font-bold text-[11px]">1 ATTEMPT ONLY</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-high/40 border border-outline-variant/30">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-tertiary text-base">shuffle</span>
                      <span>Shuffle Questions</span>
                    </div>
                    <span className="font-label-code text-on-surface font-semibold text-[11px]">ENABLED</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-outline-variant/30">
                <Link
                  href="/join"
                  className="w-full py-3 px-4 rounded-xl bg-surface-container-high hover:bg-tertiary/20 text-on-surface font-headline-sm text-xs sm:text-sm border border-outline-variant/40 hover:border-tertiary transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <span className="material-symbols-outlined text-base text-tertiary">lock_open</span>
                  <span>Enable Async Portal</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </ParallaxReveal>

      {/* Security & Proctoring Telemetry Controls */}
      <ParallaxReveal direction="up" distance={25} delay={200} duration={700}>
        <section className="rounded-xl p-5 bg-surface-container-low/75 border border-outline-variant/30 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary text-xl">shield_lock</span>
            <h3 className="font-headline-sm text-sm font-semibold text-on-surface">
              Security, Anti-Cheat & Identity Guard
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-surface-container/60 border border-outline-variant/30 flex items-center justify-between">
              <div>
                <span className="block text-on-surface font-medium">AI Anti-Cheat</span>
                <span className="text-outline text-[11px]">Detect tab switching</span>
              </div>
              <input
                type="checkbox"
                checked={antiCheat}
                onChange={(e) => setAntiCheat(e.target.checked)}
                className="rounded border-outline-variant bg-surface-container text-primary"
              />
            </div>

            <div className="p-3 rounded-lg bg-surface-container/60 border border-outline-variant/30 flex items-center justify-between">
              <div>
                <span className="block text-on-surface font-medium">Full-Screen Lock</span>
                <span className="text-outline text-[11px]">Enforce kiosk mode</span>
              </div>
              <input
                type="checkbox"
                checked={fullScreenLock}
                onChange={(e) => setFullScreenLock(e.target.checked)}
                className="rounded border-outline-variant bg-surface-container text-primary"
              />
            </div>

            <div className="p-3 rounded-lg bg-surface-container/60 border border-outline-variant/30 flex items-center justify-between">
              <div>
                <span className="block text-on-surface font-medium">Shuffle Choices</span>
                <span className="text-outline text-[11px]">Per-cadet randomization</span>
              </div>
              <input
                type="checkbox"
                checked={shuffleChoices}
                onChange={(e) => setShuffleChoices(e.target.checked)}
                className="rounded border-outline-variant bg-surface-container text-primary"
              />
            </div>

            <div className="p-3 rounded-lg bg-surface-container/60 border border-outline-variant/30 flex items-center justify-between">
              <div>
                <span className="block text-on-surface font-medium">Allow Retakes</span>
                <span className="text-outline text-[11px]">Record best score</span>
              </div>
              <input
                type="checkbox"
                checked={allowRetries}
                onChange={(e) => setAllowRetries(e.target.checked)}
                className="rounded border-outline-variant bg-surface-container text-primary"
              />
            </div>
          </div>
        </section>
      </ParallaxReveal>
      </main>

      {/* QR Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-surface-container-low border border-primary/40 rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <span className="font-headline-sm text-sm text-primary font-bold">QR Cosmic Portal</span>
              <button
                onClick={() => setShowQrModal(false)}
                className="text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="w-48 h-48 mx-auto bg-white p-3 rounded-xl flex items-center justify-center shadow-lg">
              {/* QR Code representation */}
              <div className="w-full h-full border-4 border-black p-2 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-10 h-10 bg-black" />
                  <div className="w-10 h-10 bg-black" />
                </div>
                <div className="text-[10px] font-mono text-black font-extrabold tracking-tighter">
                  SCAN TO JOIN
                </div>
                <div className="flex justify-between items-end">
                  <div className="w-10 h-10 bg-black" />
                  <div className="w-6 h-6 bg-black" />
                </div>
              </div>
            </div>
            <div className="font-label-code text-xs text-on-surface-variant">
              PIN: <span className="text-primary font-bold text-sm">{pin}</span>
            </div>
            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2 rounded-lg bg-surface-container hover:bg-surface-bright text-on-surface text-xs font-label-code"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full bg-surface-container-lowest/80 backdrop-blur-md border-t border-outline-variant/20 py-4 px-6 relative z-10 text-xs font-label-code text-on-surface-variant">
        <div className="max-w-max-width-canvas mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <span>QuizzCraft Deployment Hub • Node Cluster US-EAST-1 Active</span>
          <div className="flex items-center gap-4">
            <Link href="/join" className="text-tertiary hover:underline">
              Join Arena Portal →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function DeploySchedulePage() {
  return (
    <ProtectedRoute>
      <DeployScheduleContent />
    </ProtectedRoute>
  );
}
