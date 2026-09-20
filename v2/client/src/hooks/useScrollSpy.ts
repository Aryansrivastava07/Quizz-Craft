"use client";

import { useState, useEffect } from "react";

export function useScrollSpy(sectionIds: string[], offsetRatio = 0.45) {
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0] || "");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      setScrollProgress(progress);

      let currentActive = sectionIds[0] || "";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top <= window.innerHeight * offsetRatio) {
            currentActive = id;
          }
        }
      }
      setActiveSection(currentActive);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds, offsetRatio]);

  return { activeSection, scrollProgress };
}
