import React from "react";
import Link from "next/link";

export default function CreateFooter() {
  const links = [
    "Architecture",
    "API",
    "Status",
    "Security",
    "Privacy Policy",
    "Terms of Service",
  ];

  return (
    <footer className="w-full bg-surface-container-lowest/80 backdrop-blur-md border-t border-outline-variant/20 relative z-10 mt-16">
      <div className="max-w-max-width-canvas mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Brand & Status */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="text-headline-sm font-headline-sm text-primary font-bold flex items-center gap-2">
            <span>QuizzCraft.app</span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-[11px] font-label-code text-tertiary border border-outline-variant/40">
              v2.4 Online
            </span>
          </div>
          <p className="text-on-surface-variant text-xs font-body-sm text-center md:text-left">
            © 2025 QuizzCraft.app. All rights reserved. Tactile AI engines operational.
          </p>
        </div>

        {/* Footer Navigation Links */}
        <nav className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-xs text-on-surface-variant">
          {links.map((link) => (
            <Link
              key={link}
              className="hover:text-primary transition-colors duration-200"
              href="#"
            >
              {link}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
