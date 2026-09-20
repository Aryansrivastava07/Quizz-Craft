"use client";

import React, { useEffect, useRef, useState } from "react";

interface ParallaxRevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  delay?: number;
  duration?: number;
  parallaxSpeed?: number;
  className?: string;
  threshold?: number;
}

export default function ParallaxReveal({
  children,
  direction = "up",
  distance = 30,
  delay = 0,
  duration = 750,
  parallaxSpeed = 0,
  className = "",
  threshold = 0,
}: ParallaxRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollYOffset, setScrollYOffset] = useState(0);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Immediately reveal if already in or near viewport on mount (prevents blank screen on load)
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 150) {
      setIsVisible(true);
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      {
        threshold: 0,
        rootMargin: "200px 0px 200px 0px",
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Optional subtle active scroll parallax offset
  useEffect(() => {
    if (!parallaxSpeed) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (elementRef.current) {
            const rect = elementRef.current.getBoundingClientRect();
            const viewportCenter = window.innerHeight / 2;
            const elementCenter = rect.top + rect.height / 2;
            const diff = (elementCenter - viewportCenter) * parallaxSpeed;
            setScrollYOffset(diff);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [parallaxSpeed]);

  const getInitialTransform = () => {
    switch (direction) {
      case "up":
        return `translate3d(0, ${distance}px, 0)`;
      case "down":
        return `translate3d(0, -${distance}px, 0)`;
      case "left":
        return `translate3d(${distance}px, 0, 0)`;
      case "right":
        return `translate3d(-${distance}px, 0, 0)`;
      case "none":
      default:
        return "translate3d(0, 0, 0)";
    }
  };

  const currentTransform = isVisible
    ? parallaxSpeed
      ? `translate3d(0, ${scrollYOffset.toFixed(1)}px, 0)`
      : "translate3d(0, 0, 0)"
    : getInitialTransform();

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: currentTransform,
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}
