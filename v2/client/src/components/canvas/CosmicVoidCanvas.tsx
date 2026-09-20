"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  colorPrefix: string;
  alpha: number;
  baseAlpha: number;
}

export default function CosmicVoidCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    const mouse = { x: -9999, y: -9999, active: false };
    let animationFrameId: number;

    const starColors = [
      "rgba(223, 226, 241, ", // on-surface soft white
      "rgba(76, 215, 246, ", // tertiary cyan
      "rgba(208, 188, 255, ", // primary lavender
      "rgba(160, 120, 255, ", // primary-container violet
    ];

    const MAGNETIC_RADIUS = 160;
    const SPRING = 0.05;
    const DAMPING = 0.88;
    const PULL_FACTOR = 0.28;

    function initParticles() {
      particles = [];
      const count = Math.floor((width * height) / 8000);
      for (let i = 0; i < count; i++) {
        const hx = Math.random() * width;
        const hy = Math.random() * height;
        const colorPrefix =
          starColors[Math.floor(Math.random() * starColors.length)];
        const baseAlpha = 0.25 + Math.random() * 0.55;
        const radius =
          Math.random() < 0.2 ? 1.5 : Math.random() < 0.7 ? 1.0 : 0.7;

        particles.push({
          homeX: hx,
          homeY: hy,
          x: hx,
          y: hy,
          vx: 0,
          vy: 0,
          radius,
          colorPrefix,
          alpha: baseAlpha,
          baseAlpha,
        });
      }
    }

    function resize() {
      if (!canvas || !ctx) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      initParticles();
    }

    function renderStatic() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.fillStyle = p.colorPrefix + p.alpha + ")";
        ctx.beginPath();
        ctx.arc(p.homeX, p.homeY, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function animate() {
      if (!ctx) return;
      if (prefersReducedMotion) {
        renderStatic();
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Subtle magnetic cosmic aura around cursor
      if (mouse.active) {
        const aura = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          MAGNETIC_RADIUS
        );
        aura.addColorStop(0, "rgba(160, 120, 255, 0.12)");
        aura.addColorStop(0.45, "rgba(76, 215, 246, 0.05)");
        aura.addColorStop(1, "rgba(15, 19, 29, 0)");
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, MAGNETIC_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Update particle positions with magnetic physics and return springs
      const nearby: Particle[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);

          if (dist < MAGNETIC_RADIUS) {
            nearby.push(p);
            // Non-linear attraction toward cursor with elastic spring
            const force = (1 - dist / MAGNETIC_RADIUS) * PULL_FACTOR;
            p.vx += (dx / (dist || 1)) * force * 3.5;
            p.vy += (dy / (dist || 1)) * force * 3.5;
            p.alpha = Math.min(
              1.0,
              p.baseAlpha + (1 - dist / MAGNETIC_RADIUS) * 0.45
            );
          } else {
            p.alpha += (p.baseAlpha - p.alpha) * 0.1;
          }
        } else {
          p.alpha += (p.baseAlpha - p.alpha) * 0.1;
        }

        // Return force to home coordinate
        const returnDx = p.homeX - p.x;
        const returnDy = p.homeY - p.y;
        p.vx += returnDx * SPRING;
        p.vy += returnDy * SPRING;

        p.vx *= DAMPING;
        p.vy *= DAMPING;

        p.x += p.vx;
        p.y += p.vy;

        // Render particle
        ctx.fillStyle = p.colorPrefix + p.alpha + ")";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Gentle constellatory connections between magnetically excited particles
      if (mouse.active && nearby.length > 1) {
        ctx.lineWidth = 0.75;
        for (let i = 0; i < nearby.length; i++) {
          for (let j = i + 1; j < nearby.length; j++) {
            const p1 = nearby[i];
            const p2 = nearby[j];
            const d = Math.hypot(p1.x - p2.x, p1.y - p2.y);
            if (d < 85) {
              const lineAlpha = (1 - d / 85) * 0.22;
              ctx.strokeStyle = `rgba(160, 120, 255, ${lineAlpha})`;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", resize);

    resize();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      {/* Deep Space Ambient Nebulae */}
      <div className="absolute -top-32 -left-32 w-[580px] h-[580px] bg-primary-container/20 rounded-full blur-[140px]" />
      <div className="absolute -bottom-32 -right-32 w-[620px] h-[620px] bg-tertiary/12 rounded-full blur-[150px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-surface-container-lowest/60 rounded-full blur-[180px]" />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        id="cosmic-void-canvas"
      />
    </div>
  );
}
