"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CosmicCanvas from "@/components/canvas/CosmicCanvas";
import Navbar from "@/components/layout/Navbar";
import ParallaxReveal from "@/components/ui/ParallaxReveal";

export default function JoinQuizPage() {
  const router = useRouter();
  const [pinCode, setPinCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsJoining(true);
    setTimeout(() => {
      router.push("/quiz");
    }, 600);
  };

  return (
    <main className="min-h-screen relative overflow-x-hidden flex flex-col justify-between">
      {/* Universal Cosmic Starfield Canvas */}
      <CosmicCanvas />

      {/* Universal Top Navbar */}
      <Navbar />

      {/* Main Centered Join Container */}
      <div className="relative z-10 flex items-center justify-center pt-28 pb-16 px-4 sm:px-6">
        <ParallaxReveal direction="up" distance={25} delay={80} duration={750} className="w-full max-w-lg">
          <div className="w-full rounded-2xl glass-kage border border-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high/80 border border-primary/30 text-tertiary font-headline-sm text-xs mb-3 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
              <span>LIVE QUIZ ARENA</span>
            </div>
            <h1 className="font-headline-lg text-2xl sm:text-3xl text-on-surface font-bold tracking-tight">
              Join a Live Game
            </h1>
            <p className="font-body-sm text-xs text-on-surface-variant mt-1.5">
              Enter the room PIN provided by your instructor or host.
            </p>
          </div>

          {/* Authenticated Player Profile (User must be logged in - No manual nickname entry) */}
          <div className="p-3.5 rounded-xl bg-surface-container/60 border border-outline-variant/30 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-container/80 border border-primary/40 flex items-center justify-center text-white font-bold text-xs shadow-md">
                AR
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-semibold text-white">Alex Rivera</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" title="Active Account" />
                </div>
                <p className="text-[11px] font-label-code text-on-surface-variant">
                  alexander@university.edu • Level 14
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] font-label-code text-tertiary bg-tertiary/10 px-2 py-0.5 rounded border border-tertiary/25 font-medium">
                Logged In
              </span>
              <Link href="/auth" className="text-[10px] text-outline hover:text-primary transition-colors">
                Switch account
              </Link>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1.5 uppercase tracking-wider text-tertiary font-label-code">
                Game PIN
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  placeholder="e.g. 884-219"
                  className="w-full px-4 py-3.5 rounded-xl bg-surface-container/60 border border-outline-variant/40 text-on-surface placeholder:text-outline text-xl font-label-code font-bold tracking-widest text-center focus:outline-none focus:border-primary transition-colors"
                />
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                  pin
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant mt-1.5 text-center font-label-code">
                Enter the 6-digit room PIN provided by your host to connect.
              </p>
            </div>

            <button
              type="submit"
              disabled={isJoining}
              className="w-full mt-3 py-3.5 px-4 rounded-xl bg-primary-container hover:bg-primary-container/90 text-white font-headline-sm text-sm font-semibold shadow-sm border border-white/10 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isJoining ? (
                <>
                  <span className="material-symbols-outlined text-base animate-spin">
                    progress_activity
                  </span>
                  <span>Entering Arena...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">login</span>
                  <span>Enter Quiz Arena</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant">
            <span>Want to create a quiz instead?</span>
            <Link href="/create" className="text-tertiary hover:underline font-medium">
              Launch Studio →
            </Link>
          </div>
        </div>
        </ParallaxReveal>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-on-surface-variant border-t border-outline-variant/20 backdrop-blur-md">
        © 2026 QuizzCraft.app • Interactive 3D Learning Platform
      </footer>
    </main>
  );
}
