"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CosmicVoidCanvas from "@/components/canvas/CosmicVoidCanvas";
import ParallaxReveal from "@/components/ui/ParallaxReveal";
import { useAuth } from "@/lib/auth/auth-context";
import { formatApiError } from "@/lib/api/client";

export default function AuthPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Auto-dismiss toasts after 6 seconds
  useEffect(() => {
    if (authError) {
      const timer = setTimeout(() => setAuthError(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [authError]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (mode === "signin") {
        await login({ email, password });
        router.push("/profile");
      } else {
        const username =
          fullName.trim().toLowerCase().replace(/\s+/g, "_") ||
          email.split("@")[0] ||
          "user";
        const result = await register({ username, email, password });
        setSuccessMessage(
          result.message || "Account created! Check your email for OTP."
        );
      }
    } catch (err: any) {
      setAuthError(formatApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body-md text-body-md min-h-screen cosmic-void relative flex flex-col justify-between overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
      {/* Stitch Cosmic Void Canvas with Interactive Cursor Physics */}
      <CosmicVoidCanvas />

      {/* Stitch Focused Minimal Header (NO standard navbar on auth page) */}
      <header className="relative z-20 w-full max-w-[1280px] mx-auto px-4 sm:px-8 pt-6 flex justify-between items-center">
        {/* Brand Identity Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-surface-container-high border border-outline-variant/40 flex items-center justify-center relative overflow-hidden shadow-lg shadow-primary-container/10 group-hover:border-primary transition-colors duration-300">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-container/30 to-tertiary/20" />
            <span className="material-symbols-outlined text-primary relative z-10 text-xl">
              bolt
            </span>
          </div>
          <span className="font-headline-sm text-base text-primary font-extrabold tracking-tight">
            QuizzCraft<span className="text-tertiary">.app</span>
          </span>
        </Link>

        {/* Top Right Minimal Return Action */}
        <Link
          href="/"
          className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors duration-200 py-1.5 px-4 rounded-full bg-surface-container-low/60 backdrop-blur-md border border-outline-variant/30 text-xs font-medium"
        >
          <span>Explore Quizzes</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </header>

      {/* Main Stitch Central Auth Stage */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-10">
        <ParallaxReveal direction="up" distance={25} duration={750} className="w-full max-w-[1040px]">
          <div className="w-full rounded-3xl luminous-card backdrop-blur-2xl border border-outline-variant/30 overflow-hidden relative shadow-2xl">
            {/* Luminous Edge Flare Overlay */}
            <div className="absolute -top-32 -left-32 w-80 h-80 bg-primary-container/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-tertiary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 relative z-10 min-h-[620px]">
            {/* Left Column: Visual Image with ONLY Company Logo & No Text Around It */}
            <div className="lg:col-span-5 relative flex items-center justify-center p-8 sm:p-12 overflow-hidden border-b lg:border-b-0 lg:border-r border-outline-variant/20 bg-surface-container-lowest/80 min-h-[300px] lg:min-h-[580px]">
              {/* Stitch 3D Cosmic Visual Render */}
              <img
                src="/stitch/screen-6-cosmic-portal-3d.png"
                alt="Cosmic Knowledge Portal"
                className="absolute inset-0 w-full h-full object-cover opacity-75 transform hover:scale-105 transition-transform duration-700 ease-out pointer-events-none"
              />
              {/* Ambient Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/90 via-surface-container-lowest/40 to-surface-container-lowest/70 pointer-events-none" />

              {/* Company Logo Centered On The Image - With STRICTLY NO TEXT around it */}
              <div className="relative z-10 flex items-center justify-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-primary-container/90 border border-white/25 flex items-center justify-center shadow-2xl shadow-primary-container/60 backdrop-blur-md transform transition-transform duration-300 hover:scale-110">
                  <span className="material-symbols-outlined text-white text-4xl sm:text-5xl">
                    bolt
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Stitch Authentication Form */}
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
              <div>
                {/* Pill Segmented Switcher & Live Orbit Status */}
                <div className="flex items-center justify-between mb-6">
                  <div className="inline-flex p-1 rounded-full bg-surface-container-lowest/90 border border-outline-variant/30">
                    <button
                      type="button"
                      onClick={() => setMode("signin")}
                      className={`px-4 py-1.5 rounded-full font-headline-sm text-xs font-semibold transition-all ${
                        mode === "signin"
                          ? "bg-primary text-on-primary shadow-sm"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("signup")}
                      className={`px-4 py-1.5 rounded-full font-headline-sm text-xs font-semibold transition-all ${
                        mode === "signup"
                          ? "bg-primary text-on-primary shadow-sm"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      Create Account
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-label-code text-tertiary">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
                    <span>Node Orbit: Active</span>
                  </div>
                </div>

                {/* Form Heading */}
                <div className="mb-6">
                  <h1 className="font-headline-lg text-2xl sm:text-3xl text-on-surface font-bold tracking-tight">
                    {mode === "signin"
                      ? "Welcome to QuizzCraft"
                      : "Create Your Account"}
                  </h1>
                  <p className="font-body-sm text-xs text-on-surface-variant mt-1.5">
                    {mode === "signin"
                      ? "Enter your credentials to access your quiz studio."
                      : "Start turning documents and notes into interactive 3D quizzes."}
                  </p>
                </div>

                {/* Social Authentication Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthError("OAuth sign-in (Google) is missing in the backend. Please authenticate with your email & password.");
                    }}
                    className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-surface-container-low/80 hover:bg-surface-container border border-outline-variant/30 hover:border-primary/40 transition-all text-on-surface text-xs font-medium active:scale-95 cursor-pointer shadow-sm"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        d="M12 5c1.54 0 2.93.56 4.02 1.48l3.01-3.01C17.21 1.76 14.77 1 12 1 7.42 1 3.55 3.63 1.64 7.45l3.69 2.87C6.22 7.37 8.87 5 12 5z"
                        fill="#EA4335"
                      />
                      <path
                        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.28 1.48-1.12 2.73-2.39 3.58l3.68 2.86c2.15-1.99 3.43-4.91 3.43-8.68z"
                        fill="#4285F4"
                      />
                      <path
                        d="M5.33 14.68A6.98 6.98 0 0 1 4.98 12c0-.94.13-1.85.35-2.68L1.64 6.45A11.96 11.96 0 0 0 .5 12c0 1.92.46 3.73 1.14 5.35l3.69-2.67z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.68-2.86c-1.07.72-2.45 1.16-4.25 1.16-3.13 0-5.78-2.37-6.67-5.32L1.64 15.68C3.55 19.5 7.42 22.13 12 22.13z"
                        fill="#34A853"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthError("OAuth sign-in (GitHub) is missing in the backend. Please authenticate with your email & password.");
                    }}
                    className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-surface-container-low/80 hover:bg-surface-container border border-outline-variant/30 hover:border-primary/40 transition-all text-on-surface text-xs font-medium active:scale-95 cursor-pointer shadow-sm"
                  >
                    <svg
                      className="w-4 h-4 fill-current shrink-0 text-white"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      />
                    </svg>
                    <span>Continue with GitHub</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="relative flex items-center my-6">
                  <div className="flex-grow border-t border-outline-variant/30" />
                  <span className="flex-shrink-0 mx-4 px-3.5 py-1 text-[11px] font-label-code text-on-surface-variant uppercase tracking-wider rounded-full bg-surface-container-lowest border border-outline-variant/30 whitespace-nowrap shadow-sm">
                    or continue with email
                  </span>
                  <div className="flex-grow border-t border-outline-variant/30" />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === "signup" && (
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-on-surface-variant">
                        Full Name
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                          badge
                        </span>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Prof. Alex Vance"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-lowest/90 border border-outline-variant/50 text-on-surface placeholder:text-outline text-xs focus:outline-none focus:border-primary focus:bg-surface-container-low transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-on-surface-variant">
                        Work or Student Email
                      </label>
                      <span className="text-[10px] font-label-code text-tertiary">
                        SSO Enabled
                      </span>
                    </div>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                        mail
                      </span>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alexander@university.edu"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-lowest/90 border border-outline-variant/50 text-on-surface placeholder:text-outline text-xs focus:outline-none focus:border-primary focus:bg-surface-container-low transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-on-surface-variant">
                        Password
                      </label>
                      {mode === "signin" && (
                        <button
                          type="button"
                          className="text-[11px] font-label-code text-primary hover:text-primary-fixed transition-colors"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                        lock
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-surface-container-lowest/90 border border-outline-variant/50 text-on-surface placeholder:text-outline text-xs focus:outline-none focus:border-primary focus:bg-surface-container-low transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">
                          {showPassword ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-on-surface-variant">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-outline-variant/60 bg-surface-container-lowest text-primary focus:ring-0"
                      />
                      <span>Remember credentials for 30 days</span>
                    </label>
                  </div>

                  {/* Mature Solid Single-Color CTA */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3 px-6 rounded-xl bg-primary-container hover:bg-primary-container/90 text-white font-headline-sm text-xs font-semibold shadow-sm border border-white/10 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <span className="material-symbols-outlined text-base animate-spin">
                          progress_activity
                        </span>
                        <span>
                          {mode === "signin"
                            ? "Signing in to Studio..."
                            : "Creating Studio Account..."}
                        </span>
                      </>
                    ) : (
                      <>
                        <span>
                          {mode === "signin"
                            ? "Sign In to Studio"
                            : "Create Studio Account"}
                        </span>
                        <span className="material-symbols-outlined text-base">
                          bolt
                        </span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Cryptographic Security Footer */}
              <div className="pt-6 mt-6 border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-on-surface-variant text-[11px] font-label-code">
                <div className="flex items-center gap-1.5 text-tertiary">
                  <span className="material-symbols-outlined text-sm">
                    shield
                  </span>
                  <span>Zero data leakage for proprietary courseware</span>
                </div>
                <div className="flex items-center gap-1 text-outline">
                  <span className="material-symbols-outlined text-sm">
                    lock
                  </span>
                  <span>256-bit AES encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ParallaxReveal>
    </main>

      {/* Stitch Focused Auth Footer */}
      <footer className="relative z-20 w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-on-surface-variant font-body-sm text-xs border-t border-outline-variant/20">
        <p>© 2026 QuizzCraft.app • Spatial Learning Engine</p>
        <div className="flex items-center gap-6 font-label-code text-xs">
          <Link href="/privacy" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-primary transition-colors">
            Terms of Service
          </Link>
          <Link href="/status" className="hover:text-primary transition-colors">
            System Status
          </Link>
        </div>
      </footer>

      {/* Floating Error Toast Notification */}
      {authError && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100vw-3rem)] animate-bounce">
          <div className="p-4 rounded-2xl bg-[#0b0e1b]/95 border border-red-500/50 text-red-200 shadow-2xl shadow-red-500/30 backdrop-blur-2xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-red-400 text-lg">
                error
              </span>
            </div>
            <div className="flex-1 pr-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-white text-xs uppercase tracking-wider font-headline-sm">
                  Internal Server Error
                </p>
                <button
                  type="button"
                  onClick={() => setAuthError(null)}
                  className="text-on-surface-variant hover:text-white transition-colors p-0.5 rounded-lg cursor-pointer"
                  aria-label="Dismiss error toast"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>
              <p className="mt-1 text-xs text-red-200/90 leading-relaxed break-words font-body-sm">
                {authError}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Success Toast Notification */}
      {successMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100vw-3rem)] animate-bounce">
          <div className="p-4 rounded-2xl bg-[#0b0e1b]/95 border border-emerald-500/50 text-emerald-200 shadow-2xl shadow-emerald-500/30 backdrop-blur-2xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-emerald-400 text-lg">
                check_circle
              </span>
            </div>
            <div className="flex-1 pr-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-white text-xs uppercase tracking-wider font-headline-sm">
                  Notification
                </p>
                <button
                  type="button"
                  onClick={() => setSuccessMessage(null)}
                  className="text-on-surface-variant hover:text-white transition-colors p-0.5 rounded-lg cursor-pointer"
                  aria-label="Dismiss success toast"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>
              <p className="mt-1 text-xs text-emerald-200/90 leading-relaxed break-words font-body-sm">
                {successMessage}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
