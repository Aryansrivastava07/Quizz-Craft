"use client";

import Link from "next/link";
import { useState } from "react";

export default function CreateHeader() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-max-width-canvas rounded-full bg-surface-container-lowest/75 backdrop-blur-xl border border-outline-variant/30 shadow-2xl shadow-primary-container/10 flex justify-between items-center px-6 py-2.5 z-50 transition-all duration-300">
      {/* Brand Logo Anchor */}
      <Link
        className="flex items-center gap-2 text-headline-sm font-headline-sm tracking-tight text-primary font-extrabold group"
        href="/"
      >
        <span className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center border border-primary/40 shadow-inner group-hover:border-primary transition-all">
          <span className="material-symbols-outlined text-primary">school</span>
        </span>
        <span>QuizzCraft.app</span>
      </Link>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center gap-6 font-headline-sm text-body-md text-sm">
        <Link
          className="text-on-surface-variant transition-colors hover:text-primary transition-all duration-300"
          href="/#ch-02"
        >
          Showcase
        </Link>
        <Link
          className="text-on-surface-variant transition-colors hover:text-primary transition-all duration-300"
          href="/#how-it-works"
        >
          How It Works
        </Link>
        <Link
          className="text-primary font-semibold border-b-2 border-primary pb-0.5"
          href="/create"
        >
          Demo
        </Link>
        <Link
          className="text-on-surface-variant transition-colors hover:text-primary transition-all duration-300"
          href="/#ch-04"
        >
          Personas
        </Link>
      </nav>

      {/* Trailing Actions & Controls */}
      <div className="flex items-center gap-3">
        {/* Dark/Light Mode Pill Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          aria-label="Toggle visual theme"
          className="w-10 h-6 rounded-full bg-surface-container-highest p-0.5 border border-outline-variant/50 flex items-center transition-colors"
        >
          <div
            className={`w-5 h-5 rounded-full bg-surface-dim border border-primary/40 flex items-center justify-center shadow-sm transition-transform ${
              isDarkMode ? "translate-x-4" : "translate-x-0"
            }`}
          >
            <span
              className="material-symbols-outlined text-tertiary"
              style={{ fontSize: "13px" }}
            >
              {isDarkMode ? "dark_mode" : "light_mode"}
            </span>
          </div>
        </button>

        {/* Sign In */}
        <Link
          className="hidden sm:inline-flex text-on-surface-variant hover:text-primary font-headline-sm text-xs px-2 py-1.5 transition-colors"
          href="/auth"
        >
          Sign In
        </Link>

        {/* Launch Studio Action */}
        <Link
          href="/create"
          className="btn-kinetic active:scale-95 transition-transform duration-150 text-white font-headline-sm text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 cursor-pointer"
        >
          <span
            className="material-symbols-outlined text-white"
            style={{ fontSize: "16px" }}
          >
            bolt
          </span>
          <span>Launch Studio</span>
        </Link>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full ring-2 ring-primary/40 overflow-hidden ml-1 hidden sm:block">
          <img
            className="w-full h-full object-cover"
            alt="User avatar"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDasytanrbPihuNOGRp9pWMUk_BlFIHcPv90sw-p1_rSOAFpw9HvuNXCOWuRwYsGIbQcycEHE91t3zCLi8BdMj3pHud7lkaWrZmpDBZ2O4GTi4_T28BGkD-wjrkjKIdAaOxRxZNTTKKUoknFrp4iGRC3sApEhvKU54eGne0XdHQ6ScX7wtPZhuShxuS4-MLn7S7HEPG7TrqeD_cJxaj_-DwfM1DbpYfbR8DjeLxhaXTpxNlxFsOVrTm"
          />
        </div>
      </div>
    </header>
  );
}
