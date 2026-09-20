"use client";

import { useEffect, useRef, useState } from "react";

interface StarTier1 {
  x: number;
  y: number;
  size: number;
  alpha: number;
}

interface StarTier2 {
  x: number;
  y: number;
  size: number;
  alpha: number;
  color: string;
}

export default function CosmicCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Subtle background mount transition
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(timer);
  }, []);

  // Smooth scroll parallax listener
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const starsTier1: StarTier1[] = [];
    const starsTier2: StarTier2[] = [];

    const initStars = () => {
      starsTier1.length = 0;
      starsTier2.length = 0;

      const t1Count = Math.floor((width * height) / 4500);
      const t2Count = Math.floor((width * height) / 12000);

      for (let i = 0; i < t1Count; i++) {
        starsTier1.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 0.9 + 0.3,
          alpha: Math.random() * 0.25 + 0.15,
        });
      }

      for (let i = 0; i < t2Count; i++) {
        starsTier2.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.2 + 0.6,
          alpha: Math.random() * 0.35 + 0.25,
          color:
            Math.random() > 0.6
              ? "#c3c0ff"
              : Math.random() > 0.5
              ? "#7dd3fc"
              : "#dfe2f1",
        });
      }
    };

    initStars();

    let currScrollY = window.scrollY;
    let mouseX = width / 2;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    const handleScrollPos = () => {
      currScrollY = window.scrollY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      setMouseOffset({
        x: (e.clientX - width / 2) / (width / 2),
        y: (e.clientY - height / 2) / (height / 2),
      });
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScrollPos, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const renderCosmos = () => {
      ctx.clearRect(0, 0, width, height);

      const pX = (mouseX - width / 2) * 0.025;
      const scrollT1 = currScrollY * 0.06;
      const scrollT2 = currScrollY * 0.16;

      // Distant Stardust
      ctx.fillStyle = "#ffffff";
      for (const s of starsTier1) {
        const drawY = (s.y - scrollT1) % height;
        const finalY = drawY < 0 ? drawY + height : drawY;
        ctx.globalAlpha = s.alpha;
        ctx.beginPath();
        ctx.arc(s.x + pX * 0.4, finalY, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Near Crisp Stars
      for (const s of starsTier2) {
        const drawY = (s.y - scrollT2) % height;
        const finalY = drawY < 0 ? drawY + height : drawY;

        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x + pX * 1.05, finalY, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(renderCosmos);
    };

    renderCosmos();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScrollPos);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden transition-all duration-[1400ms] ease-out ${
        mounted ? "opacity-100 scale-100 filter-none" : "opacity-0 scale-[1.03] blur-[3px]"
      }`}
    >
      {/* Real-Time Parallax Starfield Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-screen h-screen pointer-events-none"
      />

      {/* Subdued Ambient Celestial Tint Layers with Scroll Parallax */}
      <div
        className="fixed top-[-10%] left-1/4 w-[850px] h-[850px] rounded-full bg-gradient-to-br from-primary-container/15 via-primary/5 to-transparent blur-[160px] pointer-events-none nebula-violet -z-10 transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${mouseOffset.x * 15}px, ${scrollY * 0.08}px, 0)`,
        }}
      />
      <div
        className="fixed top-[32%] right-[-10%] w-[750px] h-[750px] rounded-full bg-gradient-to-bl from-tertiary-container/15 via-tertiary/5 to-transparent blur-[180px] pointer-events-none nebula-cyan -z-10 transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${-mouseOffset.x * 20}px, ${-scrollY * 0.05}px, 0)`,
        }}
      />
      <div
        className="fixed bottom-[-10%] left-[-5%] w-[800px] h-[700px] rounded-full bg-gradient-to-tr from-secondary-container/15 via-primary-container/5 to-transparent blur-[160px] pointer-events-none nebula-violet -z-10 transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(0, ${scrollY * 0.04}px, 0)`,
        }}
      />

      {/* Distant Mystical Ringed Planet with Dual Parallax */}
      <div
        className="fixed top-28 right-8 lg:right-28 w-60 h-60 pointer-events-none opacity-20 lg:opacity-25 -z-10 hidden sm:block planet-static transition-transform duration-500 ease-out"
        style={{
          transform: `translate3d(${mouseOffset.x * 16}px, ${mouseOffset.y * 12 - scrollY * 0.04}px, 0) rotate(-12deg)`,
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#0a1128] via-[#141a33] to-[#4338ca]/30 border border-primary/15 shadow-none" />
          <div className="absolute w-56 h-14 rounded-[100%] border border-tertiary/20 transform -rotate-12 pointer-events-none" />
          <div className="absolute w-64 h-16 rounded-[100%] border border-primary/15 transform -rotate-12 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
