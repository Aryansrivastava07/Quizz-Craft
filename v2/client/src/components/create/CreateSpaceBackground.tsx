"use client";

import { useEffect, useRef } from "react";

export default function CreateSpaceBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const layers = container.querySelectorAll<HTMLElement>(".parallax-layer");
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let animId: number;

    const handleResize = () => {
      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates from center (-1 to 1)
      mouseX = (e.clientX - windowWidth / 2) / (windowWidth / 2);
      mouseY = (e.clientY - windowHeight / 2) / (windowHeight / 2);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const updateParallax = () => {
      // Smooth lerp easing
      targetX += (mouseX - targetX) * 0.08;
      targetY += (mouseY - targetY) * 0.08;

      layers.forEach((layer) => {
        const depth = parseFloat(layer.getAttribute("data-depth") || "0.05");
        const moveX = targetX * depth * 80;
        const moveY = targetY * depth * 80;
        layer.style.transform = `translate3d(${moveX.toFixed(2)}px, ${moveY.toFixed(2)}px, 0)`;
      });

      animId = requestAnimationFrame(updateParallax);
    };

    animId = requestAnimationFrame(updateParallax);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none cosmic-space-canvas overflow-hidden z-0"
      id="spaceCanvas"
    >
      {/* Diffuse Nebulae (Deep Layer) */}
      <div
        className="parallax-layer absolute -top-40 left-1/4 w-[750px] h-[750px] rounded-full nebula-purple opacity-70"
        data-depth="0.03"
      />
      <div
        className="parallax-layer absolute top-1/3 -left-32 w-[650px] h-[650px] rounded-full nebula-cyan opacity-60"
        data-depth="0.045"
      />
      <div
        className="parallax-layer absolute top-2/3 right-[-100px] w-[800px] h-[800px] rounded-full nebula-indigo opacity-65"
        data-depth="0.04"
      />
      <div
        className="parallax-layer absolute bottom-[-150px] left-1/3 w-[600px] h-[600px] rounded-full nebula-purple opacity-45"
        data-depth="0.025"
      />

      {/* Far Starfield (Subtle slow parallax) */}
      <div
        className="parallax-layer absolute -inset-[10%] stars-far opacity-65"
        data-depth="0.04"
      />

      {/* Celestial Bodies / Planets */}
      {/* Top-Right Gas Giant with Ring */}
      <div
        className="parallax-layer absolute top-24 -right-16 md:right-12 w-36 h-36 md:w-52 md:h-52 rounded-full planet-glow-purple flex items-center justify-center pointer-events-none opacity-85"
        data-depth="0.07"
      >
        <div className="orbit-ring w-[180%] h-[180%] absolute pointer-events-none" />
        <div className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed absolute -top-4 right-12 opacity-80 blur-[0.5px]" />
      </div>

      {/* Mid-Left Distant Cold Planet */}
      <div
        className="parallax-layer absolute top-[48%] -left-10 md:left-8 w-20 h-20 md:w-28 md:h-28 rounded-full planet-glow-cyan opacity-75 pointer-events-none"
        data-depth="0.09"
      >
        <div className="orbit-ring w-[190%] h-[190%] absolute pointer-events-none" />
      </div>

      {/* Near Starfield (Higher parallax response) */}
      <div
        className="parallax-layer absolute -inset-[12%] stars-near opacity-75"
        data-depth="0.10"
      />
    </div>
  );
}
