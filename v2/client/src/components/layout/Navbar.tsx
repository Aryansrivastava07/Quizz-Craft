"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";

interface NavbarProps {
  activeChapter?: string;
}

interface NavLinkItem {
  href: string;
  label: string;
  icon: string;
  isActive: boolean;
  hasLiveBadge?: boolean;
}

export default function Navbar({ activeChapter }: NavbarProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const pathname = usePathname();
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const centerLinks: NavLinkItem[] = [
    {
      href: "/#how-it-works",
      label: "How It Works",
      icon: "lightbulb",
      isActive: activeChapter === "how-it-works",
    },
    {
      href: "/create",
      label: "Create Quiz",
      icon: "add_circle",
      isActive:
        pathname === "/create" ||
        pathname === "/create-quiz" ||
        pathname === "/editor" ||
        pathname === "/deploy",
    },
    {
      href: "/join",
      label: "Join Quiz",
      icon: "sports_esports",
      isActive: pathname === "/join",
    },
  ];

  return (
    <header className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] sm:w-[calc(100%-2.5rem)] max-w-max-width-canvas z-50 transition-all duration-300">
      <nav className="glass-kage rounded-full border border-white/10 px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-2xl backdrop-blur-xl">
        {/* Left: Company Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-primary-container border border-white/15 flex items-center justify-center shadow-md shadow-primary-container/20 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-white text-base">
                bolt
              </span>
            </div>
            <span className="text-headline-sm font-headline-sm tracking-tight text-white font-extrabold text-base sm:text-lg">
              QuizzCraft<span className="text-tertiary">.app</span>
            </span>
          </Link>
        </div>

        {/* Center: Exactly Three Links (Join Quiz, Create Quiz, Live Arena) */}
        <div className="hidden md:flex items-center gap-1 font-headline-sm text-xs">
          {centerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                link.isActive
                  ? "bg-primary-container/20 text-white font-semibold border border-primary/40 shadow-sm"
                  : "text-on-surface-variant hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <span className="material-symbols-outlined text-[15px] text-tertiary/90">
                {link.icon}
              </span>
              <span>{link.label}</span>
              {link.hasLiveBadge && (
                <span className="flex items-center gap-1 ml-1 px-1.5 py-0.5 rounded-full bg-tertiary/10 border border-tertiary/30 text-[10px] font-label-code text-tertiary font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
                  LIVE
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Right: Profile Circular Tab OR Login/Signup Tab */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            /* Circular Profile Tab */
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full ring-2 ring-primary/40 hover:ring-primary overflow-visible transition-all cursor-pointer focus:outline-none focus:ring-primary flex items-center justify-center bg-surface-container-high"
                aria-label="User Profile Menu"
              >
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDasytanrbPihuNOGRp9pWMUk_BlFIHcPv90sw-p1_rSOAFpw9HvuNXCOWuRwYsGIbQcycEHE91t3zCLi8BdMj3pHud7lkaWrZmpDBZ2O4GTi4_T28BGkD-wjrkjKIdAaOxRxZNTTKKUoknFrp4iGRC3sApEhvKU54eGne0XdHQ6ScX7wtPZhuShxuS4-MLn7S7HEPG7TrqeD_cJxaj_-DwfM1DbpYfbR8DjeLxhaXTpxNlxFsOVrTm"
                  alt="Alex Rivera"
                  className="w-full h-full rounded-full object-cover"
                />
                {/* Online Status Beacon */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-surface-container-lowest shadow-sm" />
              </button>

              {/* Profile Dropdown Popover */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 rounded-2xl glass-kage border border-white/10 p-3 shadow-2xl backdrop-blur-2xl animate-fadeIn z-50 text-xs">
                  {/* User Header */}
                  <div className="flex items-center gap-3 p-2 pb-3 border-b border-white/10">
                    <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-primary/40 shrink-0">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDasytanrbPihuNOGRp9pWMUk_BlFIHcPv90sw-p1_rSOAFpw9HvuNXCOWuRwYsGIbQcycEHE91t3zCLi8BdMj3pHud7lkaWrZmpDBZ2O4GTi4_T28BGkD-wjrkjKIdAaOxRxZNTTKKUoknFrp4iGRC3sApEhvKU54eGne0XdHQ6ScX7wtPZhuShxuS4-MLn7S7HEPG7TrqeD_cJxaj_-DwfM1DbpYfbR8DjeLxhaXTpxNlxFsOVrTm"
                        alt="Alex Rivera"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-semibold text-white truncate text-sm">
                        {user?.username || "Authenticated User"}
                      </p>
                      <p className="text-[11px] text-on-surface-variant font-label-code truncate">
                        {user?.email || "user@quizzcraft.app"}
                      </p>
                      <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded bg-primary/10 text-primary text-[10px] font-label-code border border-primary/20">
                        {user?.verified ? "Verified Educator" : "Cadet"}
                      </span>
                    </div>
                  </div>

                  {/* Nav Links */}
                  <div className="py-2 space-y-1">
                    <Link
                      href="/profile"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-on-surface hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base text-tertiary">
                        account_circle
                      </span>
                      <span>Profile &amp; Settings</span>
                    </Link>
                    <Link
                      href="/profile?tab=my-quizzes"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-on-surface hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base text-primary">
                        folder_shared
                      </span>
                      <span>My Quizzes</span>
                    </Link>
                    <Link
                      href="/quiz"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-on-surface hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base text-amber-accent">
                        sports_esports
                      </span>
                      <span>Live Arena</span>
                    </Link>
                  </div>

                  {/* Sign Out Action */}
                  <div className="pt-2 border-t border-white/10 flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={async () => {
                        setProfileMenuOpen(false);
                        await logout();
                        router.push("/auth");
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-xs font-semibold cursor-pointer"
                    >
                      <span>Sign Out</span>
                      <span className="material-symbols-outlined text-sm">
                        logout
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Login / Signup Tab */
            <div className="flex items-center gap-2">
              <Link
                href="/auth"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary-container text-white text-xs font-semibold hover:bg-primary-container/90 border border-white/15 shadow-sm active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-sm">login</span>
                <span>Log In / Sign Up</span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-full border border-outline-variant/60 text-on-surface-variant hover:text-white transition-colors ml-1"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-xl">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-3 rounded-2xl glass-kage border border-white/10 shadow-2xl backdrop-blur-2xl flex flex-col gap-1.5 animate-fadeIn">
          {centerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-headline-sm transition-colors ${
                link.isActive
                  ? "bg-primary-container/20 text-white font-semibold border border-primary/30"
                  : "text-on-surface hover:text-white hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-base text-tertiary">
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </div>
              {link.hasLiveBadge && (
                <span className="px-2 py-0.5 rounded-full bg-tertiary/10 border border-tertiary/30 text-[10px] font-label-code text-tertiary font-bold">
                  ● LIVE
                </span>
              )}
            </Link>
          ))}

          <div className="pt-2 mt-1 border-t border-white/10 flex flex-col gap-1">
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-headline-sm text-on-surface hover:text-white hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-base text-primary">
                account_circle
              </span>
              <span>Profile / Account</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
