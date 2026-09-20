"use client";

import React from "react";
import CosmicCanvas from "@/components/canvas/CosmicCanvas";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/hero/HeroSection";
import SacredSynthesisSection from "@/components/sections/SacredSynthesisSection";
import KineticMasterySection from "@/components/sections/KineticMasterySection";
import GuildsSection from "@/components/sections/GuildsSection";
import AfterlightSection from "@/components/sections/AfterlightSection";
import Footer from "@/components/layout/Footer";
import { useScrollSpy } from "@/hooks/useScrollSpy";

const sectionIds = ["hero", "how-it-works", "ch-03", "ch-04", "ch-05"];

export default function Home() {
  const { activeSection } = useScrollSpy(sectionIds);

  return (
    <main className="min-h-screen relative overflow-x-hidden">
      {/* Cosmic Multi-layer Parallax Stars Canvas */}
      <CosmicCanvas />

      {/* Persistent Floating Header with Clean Nav */}
      <Navbar activeChapter={activeSection} />

      {/* Hero // 3D Interactive Perspective Quiz Card */}
      <HeroSection />

      {/* How It Works // Sacred Synthesis */}
      <SacredSynthesisSection />

      {/* Kinetic Mastery (Features Bento Grid) */}
      <KineticMasterySection />

      {/* Guilds & Personas (Workspaces) */}
      <GuildsSection />

      {/* Afterlight (Launch Studio CTA) */}
      <AfterlightSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
