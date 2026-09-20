"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import CosmicCanvas from "@/components/canvas/CosmicCanvas";
import Navbar from "@/components/layout/Navbar";
import ParallaxReveal from "@/components/ui/ParallaxReveal";
import { useAuth } from "@/lib/auth/auth-context";
import { profileService } from "@/lib/api/profile-service";
import { formatApiError } from "@/lib/api/client";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

type ActiveTab =
  | "profile"
  | "my-quizzes"
  | "quiz-attempted"
  | "faqs"
  | "contact-support"
  | "notifications"
  | "settings";

function ProfileContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as ActiveTab) || "profile";

  const [currentTab, setCurrentTab] = useState<ActiveTab>(initialTab);

  // Sync tab with URL search parameter if changed
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab") as ActiveTab;
    if (
      tabFromUrl &&
      [
        "profile",
        "my-quizzes",
        "quiz-attempted",
        "faqs",
        "contact-support",
        "notifications",
        "settings",
      ].includes(tabFromUrl)
    ) {
      setCurrentTab(tabFromUrl);
    }
  }, [searchParams]);

  const { user, isLoading: authLoading, logout } = useAuth();
  const [backendProfileLoading, setBackendProfileLoading] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);

  // Profile form state initialized from real auth user if available
  const [fullName, setFullName] = useState(user?.username || "Aryan Srivastava");
  const [username, setUsername] = useState(user?.username || "aryan");
  const [email, setEmail] = useState(user?.email || "aryasrivastavaq@gmail.com");
  const [institution, setInstitution] = useState("Stanford Q-Institute • Department of Physics");
  const [bio, setBio] = useState(
    "Curriculum designer and educator specializing in interactive quantum mechanics, cognitive science, and 3D spatial assessments."
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
      if (user.username) {
        setUsername(user.username);
        setFullName(user.username);
      }
    }
  }, [user]);

  const loadBackendProfile = useCallback(async () => {
    const targetEmail = user?.email || email;
    if (!targetEmail) return;
    setBackendProfileLoading(true);
    try {
      const res = await profileService.getProfile(targetEmail);
      if (res?.data) {
        if (res.data.username) {
          setUsername(res.data.username);
          setFullName(res.data.username);
        }
        setBackendError(null);
      }
    } catch (err: any) {
      setBackendError(formatApiError(err));
    } finally {
      setBackendProfileLoading(false);
    }
  }, [user?.email, email]);

  useEffect(() => {
    loadBackendProfile();
  }, [loadBackendProfile]);

  // Support ticket state
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketCategory, setTicketCategory] = useState("Technical & Live Arena");
  const [ticketUrgency, setTicketUrgency] = useState("Normal");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketSubmittedId, setTicketSubmittedId] = useState<string | null>(null);

  // FAQs search and category state
  const [faqSearch, setFaqSearch] = useState("");
  const [faqCategory, setFaqCategory] = useState("All");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // My Quizzes filter & search
  const [quizSearch, setQuizSearch] = useState("");
  const [quizFilter, setQuizFilter] = useState<"ALL" | "ACTIVE" | "DRAFT">("ALL");

  // Real Created Quizzes state from Backend
  const [createdQuizzes, setCreatedQuizzes] = useState<any[]>([]);
  const [quizzesLoading, setQuizzesLoading] = useState<boolean>(true);
  const [quizzesError, setQuizzesError] = useState<string | null>(null);

  // Real Attempted Quizzes state from Backend
  const [attemptedQuizzes, setAttemptedQuizzes] = useState<any[]>([]);
  const [attemptsLoading, setAttemptsLoading] = useState<boolean>(true);
  const [attemptsError, setAttemptsError] = useState<string | null>(null);

  const loadCreatedQuizzes = useCallback(async () => {
    setQuizzesLoading(true);
    setQuizzesError(null);
    try {
      const res = await profileService.getQuizzes();
      if (res?.data?.quizzes) {
        const mapped = res.data.quizzes.map((q: any) => ({
          id: q.quizId || q._id,
          title: q.title || "AI Generated Quiz",
          questionsCount: q.questions?.length || 0,
          playsCount: 0,
          avgScore: "Active",
          status: "ACTIVE",
          topic: q.questions?.[0]?.question ? "AI & Science" : "General Study",
          date: q.createdAt ? new Date(q.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Active Node",
        }));
        setCreatedQuizzes(mapped);
      }
    } catch (err: any) {
      console.error("Failed to load quizzes:", err);
      setQuizzesError(formatApiError(err));
    } finally {
      setQuizzesLoading(false);
    }
  }, []);

  const loadAttemptedQuizzes = useCallback(async () => {
    setAttemptsLoading(true);
    setAttemptsError(null);
    try {
      const res = await profileService.getHistory();
      const rawHistory = res?.data?.history || res?.data?.quizzes || [];
      const mapped = rawHistory.map((attempt: any) => {
        const totalQ = attempt.totalQuestions || attempt.Responses?.length || 10;
        const scoreVal = typeof attempt.score === "number" ? attempt.score : 0;
        const scorePct = totalQ > 0 ? `${Math.round((scoreVal / totalQ) * 100)}%` : "0%";
        const xpEarned = scoreVal * 150;
        const status = attempt.isActive ? "IN PROGRESS" : (scoreVal / totalQ >= 0.8 ? "EXCELLENT" : "COMPLETED");

        return {
          title: attempt.title || "Interactive Arena Challenge",
          sessionCode: attempt.sessionId ? `SES-${attempt.sessionId.slice(0, 8).toUpperCase()}` : "ACTIVE-RUN",
          scorePct,
          correctAnswers: `${scoreVal}/${totalQ}`,
          xpEarned,
          timeSpent: "Active Session",
          rank: attempt.isActive ? "Active" : "Evaluated",
          date: attempt.lastUpdateAt ? new Date(attempt.lastUpdateAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent",
          status,
          sessionId: attempt.sessionId,
          quizId: attempt.quizId,
        };
      });
      setAttemptedQuizzes(mapped);
    } catch (err: any) {
      console.error("Failed to load attempts:", err);
      setAttemptsError(formatApiError(err));
    } finally {
      setAttemptsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCreatedQuizzes();
    loadAttemptedQuizzes();
  }, [loadCreatedQuizzes, loadAttemptedQuizzes]);

  // FAQs data
  const faqs = [
    {
      category: "Creating Quizzes",
      q: "How does the AI document ingestion work with PDFs and slides?",
      a: "QuizzCraft extracts raw text, mathematical formulas, and visual diagrams from PDF, DOCX, and slide decks. The AI then organizes concepts by difficulty tier and formulates balanced 3D questions with verifiable pedagogical explanations.",
    },
    {
      category: "Creating Quizzes",
      q: "Can I customize questions and answers before publishing?",
      a: "Yes! The Quiz Editor gives you complete control over question prompts, difficulty ratings (Easy, Medium, Hard), correct answer assignments, rationale explanations, and custom EXP reward values.",
    },
    {
      category: "Hosting & Arena",
      q: "What is the difference between Live Arena and Anytime Mode?",
      a: "Live Arena is a synchronized real-time competition where the host controls question timers, live leaderboards, and interactive podium celebrations. Anytime Mode allows learners to access the quiz asynchronously at their own pace using the Universal Quiz ID.",
    },
    {
      category: "Hosting & Arena",
      q: "How many cadets can participate simultaneously in a Live Room?",
      a: "QuizzCraft rooms support up to 250 simultaneous participants per room on standard accounts, and up to 2,500 on enterprise institutional tiers with sub-50ms synchronized telemetry.",
    },
    {
      category: "Scoring & Anti-Cheat",
      q: "How are EXP points, streaks, and leaderboards calculated?",
      a: "Each question awards a base EXP value (typically 150 XP). Answering consecutive questions correctly generates streak multipliers (up to 2x bonus XP), while answer speed boosts overall leaderboard rank in tiebreaker situations.",
    },
    {
      category: "Scoring & Anti-Cheat",
      q: "How does the AI Anti-Cheat and Kiosk Lock work?",
      a: "When enabled, QuizzCraft monitors tab-switching, detects split-screen multi-tasking, and enforces full-screen kiosk locks with per-cadet answer randomization.",
    },
    {
      category: "Account & Access",
      q: "Do students need to create an account to join a game?",
      a: "No credit card or complex registration is required. Students enter the 6-digit room PIN or follow a direct link, enter their name or sign in via Google/GitHub SSO, and immediately enter the arena.",
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCat = faqCategory === "All" || faq.category === faqCategory;
    const matchesSearch =
      faq.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
      faq.a.toLowerCase().includes(faqSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const filteredCreatedQuizzes = createdQuizzes.filter((q) => {
    const matchesFilter = quizFilter === "ALL" || q.status === quizFilter;
    const matchesSearch =
      q.title.toLowerCase().includes(quizSearch.toLowerCase()) ||
      q.topic.toLowerCase().includes(quizSearch.toLowerCase()) ||
      q.id.toLowerCase().includes(quizSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalExp = attemptedQuizzes.reduce((acc, curr) => acc + (curr.xpEarned || 0), 0);
  const avgScorePct = attemptedQuizzes.length > 0
    ? Math.round(
        attemptedQuizzes.reduce((sum, a) => {
          const pctNum = parseInt(a.scorePct, 10) || 0;
          return sum + pctNum;
        }, 0) / attemptedQuizzes.length
      )
    : 0;
  const excellentAttemptsCount = attemptedQuizzes.filter(
    (a) => a.status === "EXCELLENT" || parseInt(a.scorePct, 10) >= 80
  ).length;
  const winRate = attemptedQuizzes.length > 0
    ? `${Math.round((excellentAttemptsCount / attemptedQuizzes.length) * 100)}%`
    : "0%";

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setBackendError(null);
    setIsSaving(true);
    try {
      await profileService.updateProfile({
        email,
        userName: username,
      });
      setToastMessage("Profile settings updated successfully on backend!");
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err: any) {
      setBackendError(formatApiError(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `TICK-${Math.floor(1000 + Math.random() * 9000)}-QC`;
    setTicketSubmittedId(newId);
    setToastMessage(`Support ticket ${newId} received! Our team will respond shortly.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="min-h-screen text-on-surface font-body-md selection:bg-primary selection:text-on-primary antialiased relative flex flex-col justify-between overflow-x-hidden">
      {/* Universal Cosmic Starfield Canvas */}
      <CosmicCanvas />

      {/* Universal Top Navbar */}
      <Navbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-surface-container-high/95 border border-primary/40 text-white text-xs font-semibold shadow-2xl backdrop-blur-xl animate-bounce">
          <span className="material-symbols-outlined text-primary text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="relative z-10 w-full max-w-max-width-canvas mx-auto px-4 sm:px-8 pt-28 pb-20 flex-1 flex flex-col gap-6">
        {/* Explicit Backend Error Banner */}
        {backendError && (
          <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-start gap-3 animate-fadeIn">
            <span className="material-symbols-outlined text-red-400 text-xl shrink-0 mt-0.5">
              error
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-red-200 text-sm">Backend Communication Error</p>
                <button
                  type="button"
                  onClick={loadBackendProfile}
                  className="px-3 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-200 text-xs font-semibold cursor-pointer transition-colors"
                >
                  Retry Connection
                </button>
              </div>
              <p className="mt-1 opacity-90 leading-relaxed break-words">{backendError}</p>
              <p className="mt-2 text-[11px] text-red-400/80 font-mono">
                Target Backend Endpoint: http://localhost:5000/api/profile?email={encodeURIComponent(email)}
              </p>
            </div>
          </div>
        )}

        {/* Profile Header Card */}
        <ParallaxReveal direction="up" distance={20} duration={650}>
          <div className="rounded-3xl p-6 sm:p-8 bg-surface-container-low/75 border border-outline-variant/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-tertiary/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Left: Avatar & Identity */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
                <div className="relative group">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full ring-4 ring-primary/40 p-1 bg-surface-container overflow-hidden shadow-2xl shadow-primary/30 flex items-center justify-center">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDasytanrbPihuNOGRp9pWMUk_BlFIHcPv90sw-p1_rSOAFpw9HvuNXCOWuRwYsGIbQcycEHE91t3zCLi8BdMj3pHud7lkaWrZmpDBZ2O4GTi4_T28BGkD-wjrkjKIdAaOxRxZNTTKKUoknFrp4iGRC3sApEhvKU54eGne0XdHQ6ScX7wtPZhuShxuS4-MLn7S7HEPG7TrqeD_cJxaj_-DwfM1DbpYfbR8DjeLxhaXTpxNlxFsOVrTm"
                      alt={fullName}
                      className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  {/* Online Badge */}
                  <span
                    className="absolute bottom-1 right-2 w-4 h-4 rounded-full bg-emerald-400 border-2 border-surface-container-lowest shadow-md"
                    title="Active Now"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-2xl sm:text-3xl font-headline-xl text-white font-bold tracking-tight">
                      {fullName}
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-container/30 text-primary-fixed border border-primary/40 font-label-code text-xs font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-primary">
                        verified
                      </span>
                      <span>Verified Educator</span>
                    </span>
                  </div>

                  <p className="font-label-code text-xs sm:text-sm text-on-surface-variant flex items-center justify-center sm:justify-start gap-1.5">
                    <span className="text-tertiary">@{username}</span>
                    <span>•</span>
                    <span>{email}</span>
                  </p>

                  <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-label-code text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-outline">
                        calendar_month
                      </span>
                      <span>Joined Recently</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-tertiary">
                        school
                      </span>
                      <span>Level 14 • Quizmaster</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Quick Launch Studio Action */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                <Link
                  href="/create"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary-container hover:bg-primary-container/90 text-white font-headline-sm text-xs font-semibold flex items-center justify-center gap-2 shadow-sm border border-white/10 active:scale-95 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">add_circle</span>
                  <span>Create New Quiz</span>
                </Link>
                <Link
                  href="/join"
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 text-on-surface hover:text-white font-headline-sm text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-base text-tertiary">
                    sports_esports
                  </span>
                  <span>Join Live Game</span>
                </Link>
              </div>
            </div>
          </div>
        </ParallaxReveal>

        {/* Elevated Stat Badges (Inspired by the Reference Image Pills, but modern & data-rich) */}
        <ParallaxReveal direction="up" distance={20} delay={60} duration={700}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Pill 1: Quizzes Created */}
            <div
              onClick={() => setCurrentTab("my-quizzes")}
              className="p-4 rounded-2xl bg-surface-container-low/75 border border-primary/30 hover:border-primary/60 transition-all cursor-pointer backdrop-blur-xl group shadow-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary-container/20 border border-primary/40 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-xl">edit_document</span>
                </div>
                <div>
                  <span className="block font-label-code text-[11px] text-on-surface-variant uppercase tracking-wider">
                    Quizzes Created
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-stat-counter text-2xl font-bold text-white">
                      {quizzesLoading ? "..." : createdQuizzes.length}
                    </span>
                    <span className="text-xs text-primary font-label-code font-semibold">
                      ({createdQuizzes.filter((q) => q.status === "ACTIVE").length} Active)
                    </span>
                  </div>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline group-hover:text-primary group-hover:translate-x-1 transition-all text-lg">
                arrow_forward
              </span>
            </div>

            {/* Pill 2: Average Score (Emerald Star) */}
            <div className="p-4 rounded-2xl bg-surface-container-low/75 border border-emerald-500/30 hover:border-emerald-500/60 transition-all backdrop-blur-xl shadow-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <span className="material-symbols-outlined text-xl">star</span>
                </div>
                <div>
                  <span className="block font-label-code text-[11px] text-on-surface-variant uppercase tracking-wider">
                    Average Score
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-stat-counter text-2xl font-bold text-emerald-400">
                      {attemptsLoading ? "..." : attemptedQuizzes.length > 0 ? `${avgScorePct}%` : "0%"}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-label-code font-bold">
                      {avgScorePct >= 90 ? "Grade A+" : avgScorePct >= 75 ? "Grade A" : avgScorePct >= 50 ? "Grade B" : "Unranked"}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-label-code text-emerald-400 font-bold">
                {attemptedQuizzes.length > 0 ? "Top Score" : "No Attempts"}
              </span>
            </div>

            {/* Pill 3: Quizzes Submitted / Attempted */}
            <div
              onClick={() => setCurrentTab("quiz-attempted")}
              className="p-4 rounded-2xl bg-surface-container-low/75 border border-tertiary/30 hover:border-tertiary/60 transition-all cursor-pointer backdrop-blur-xl group shadow-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-tertiary-container/20 border border-tertiary/40 flex items-center justify-center text-tertiary group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-xl">fact_check</span>
                </div>
                <div>
                  <span className="block font-label-code text-[11px] text-on-surface-variant uppercase tracking-wider">
                    Quizzes Attempted
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-stat-counter text-2xl font-bold text-white">
                      {attemptsLoading ? "..." : attemptedQuizzes.length}
                    </span>
                    <span className="text-xs text-tertiary font-label-code font-semibold">
                      ({winRate} Win Rate)
                    </span>
                  </div>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline group-hover:text-tertiary group-hover:translate-x-1 transition-all text-lg">
                arrow_forward
              </span>
            </div>

            {/* Pill 4: Total EXP & Fleet Standing */}
            <div className="p-4 rounded-2xl bg-surface-container-low/75 border border-amber-accent/30 hover:border-amber-accent/60 transition-all backdrop-blur-xl shadow-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-amber-accent/15 border border-amber-accent/40 flex items-center justify-center text-amber-accent">
                  <span className="material-symbols-outlined text-xl">military_tech</span>
                </div>
                <div>
                  <span className="block font-label-code text-[11px] text-on-surface-variant uppercase tracking-wider">
                    Total EXP Awarded
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-stat-counter text-2xl font-bold text-amber-accent">
                      {attemptsLoading ? "..." : totalExp.toLocaleString()}
                    </span>
                    <span className="text-xs text-on-surface-variant font-label-code">XP</span>
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-label-code text-amber-accent font-bold">
                {totalExp >= 10000 ? "Grandmaster" : totalExp >= 3000 ? "Navigator" : "Cadet"}
              </span>
            </div>
          </div>
        </ParallaxReveal>

        {/* Main Workspace Layout (Sidebar + Dynamic Right Content) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Sidebar Navigation */}
          <aside className="lg:col-span-3 flex flex-col gap-4 sticky top-24">
            <ParallaxReveal direction="up" distance={20} delay={90} duration={700}>
              <div className="rounded-2xl p-4 bg-surface-container-low/80 border border-outline-variant/30 backdrop-blur-xl shadow-2xl flex flex-col gap-5">
                {/* Group 1: Management */}
                <div className="space-y-1.5">
                  <span className="font-headline-sm text-[11px] font-bold text-outline uppercase tracking-wider px-3">
                    Management
                  </span>

                  <button
                    type="button"
                    onClick={() => setCurrentTab("profile")}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-headline-sm text-xs transition-all cursor-pointer ${
                      currentTab === "profile"
                        ? "bg-primary-container text-white font-semibold shadow-md shadow-primary-container/30 border border-white/10"
                        : "text-on-surface-variant hover:text-white hover:bg-surface-container"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-lg">account_circle</span>
                      <span>Profile</span>
                    </div>
                    {currentTab === "profile" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentTab("my-quizzes")}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-headline-sm text-xs transition-all cursor-pointer ${
                      currentTab === "my-quizzes"
                        ? "bg-primary-container text-white font-semibold shadow-md shadow-primary-container/30 border border-white/10"
                        : "text-on-surface-variant hover:text-white hover:bg-surface-container"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-lg">edit_document</span>
                      <span>Quiz Created</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-[10px] font-label-code font-bold">
                      {quizzesLoading ? "..." : createdQuizzes.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentTab("quiz-attempted")}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-headline-sm text-xs transition-all cursor-pointer ${
                      currentTab === "quiz-attempted"
                        ? "bg-primary-container text-white font-semibold shadow-md shadow-primary-container/30 border border-white/10"
                        : "text-on-surface-variant hover:text-white hover:bg-surface-container"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-lg">check_circle</span>
                      <span>Quiz Attempted</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-[10px] font-label-code font-bold">
                      {attemptsLoading ? "..." : attemptedQuizzes.length}
                    </span>
                  </button>
                </div>

                {/* Group 2: Support & Knowledge */}
                <div className="space-y-1.5 pt-3 border-t border-outline-variant/20">
                  <span className="font-headline-sm text-[11px] font-bold text-outline uppercase tracking-wider px-3">
                    Support &amp; Community
                  </span>

                  <button
                    type="button"
                    onClick={() => setCurrentTab("faqs")}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-headline-sm text-xs transition-all cursor-pointer ${
                      currentTab === "faqs"
                        ? "bg-primary-container text-white font-semibold shadow-md shadow-primary-container/30 border border-white/10"
                        : "text-on-surface-variant hover:text-white hover:bg-surface-container"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-lg">help_center</span>
                      <span>FAQs</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-[10px] font-label-code font-bold">
                      7
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentTab("contact-support")}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-headline-sm text-xs transition-all cursor-pointer ${
                      currentTab === "contact-support"
                        ? "bg-primary-container text-white font-semibold shadow-md shadow-primary-container/30 border border-white/10"
                        : "text-on-surface-variant hover:text-white hover:bg-surface-container"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-lg">headset_mic</span>
                      <span>Contact Support</span>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" title="Online" />
                  </button>
                </div>

                {/* Group 3: User & Preferences */}
                <div className="space-y-1.5 pt-3 border-t border-outline-variant/20">
                  <span className="font-headline-sm text-[11px] font-bold text-outline uppercase tracking-wider px-3">
                    User
                  </span>

                  <button
                    type="button"
                    onClick={() => setCurrentTab("notifications")}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-headline-sm text-xs transition-all cursor-pointer ${
                      currentTab === "notifications"
                        ? "bg-primary-container text-white font-semibold shadow-md shadow-primary-container/30 border border-white/10"
                        : "text-on-surface-variant hover:text-white hover:bg-surface-container"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-lg">notifications</span>
                      <span>Notification</span>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentTab("settings")}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-headline-sm text-xs transition-all cursor-pointer ${
                      currentTab === "settings"
                        ? "bg-primary-container text-white font-semibold shadow-md shadow-primary-container/30 border border-white/10"
                        : "text-on-surface-variant hover:text-white hover:bg-surface-container"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-lg">settings</span>
                      <span>Settings</span>
                    </div>
                  </button>
                </div>

                {/* Sidebar Footer Logout */}
                <div className="pt-3 border-t border-outline-variant/20">
                  <Link
                    href="/auth"
                    className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-on-surface-variant hover:text-error hover:bg-error-container/10 transition-colors text-xs font-headline-sm"
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">logout</span>
                      <span>Switch Account</span>
                    </span>
                    <span className="text-[10px] font-label-code text-outline">SSO</span>
                  </Link>
                </div>
              </div>
            </ParallaxReveal>
          </aside>

          {/* Right Content Area */}
          <section className="lg:col-span-9 flex flex-col gap-6">
            {/* TAB 1: PROFILE & ACCOUNT DETAILS */}
            {currentTab === "profile" && (
              <ParallaxReveal direction="up" distance={25} duration={700}>
                <div className="rounded-2xl p-6 sm:p-8 bg-surface-container-low/75 border border-outline-variant/30 backdrop-blur-2xl shadow-2xl space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-headline-lg font-bold text-white">
                        Account Details
                      </h2>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Manage your educator credentials, display persona, and security authentication
                      </p>
                    </div>
                    <span className="font-label-code text-xs px-2.5 py-1 rounded-full bg-tertiary/10 text-tertiary border border-tertiary/30 font-semibold">
                      ID: ARYAN-9824
                    </span>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-white uppercase tracking-wider font-headline-sm">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-surface-container/60 border border-outline-variant/40 text-on-surface text-xs focus:outline-none focus:border-primary transition-colors"
                        />
                      </div>

                      {/* Username */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-white uppercase tracking-wider font-headline-sm">
                          Username
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline font-label-code text-xs">
                            @
                          </span>
                          <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-surface-container/60 border border-outline-variant/40 text-on-surface text-xs focus:outline-none focus:border-primary transition-colors"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-semibold text-white uppercase tracking-wider font-headline-sm">
                            Email Address
                          </label>
                          <span className="text-[10px] text-emerald-400 font-label-code font-bold">
                            ✓ Verified
                          </span>
                        </div>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-surface-container/60 border border-outline-variant/40 text-on-surface text-xs focus:outline-none focus:border-primary transition-colors"
                        />
                      </div>

                      {/* Institution / Department */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-white uppercase tracking-wider font-headline-sm">
                          Affiliated Institution
                        </label>
                        <input
                          type="text"
                          value={institution}
                          onChange={(e) => setInstitution(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-surface-container/60 border border-outline-variant/40 text-on-surface text-xs focus:outline-none focus:border-primary transition-colors"
                        />
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-white uppercase tracking-wider font-headline-sm">
                        Curator Bio &amp; Pedagogical Specialty
                      </label>
                      <textarea
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full p-3.5 rounded-xl bg-surface-container/60 border border-outline-variant/40 text-on-surface text-xs focus:outline-none focus:border-primary transition-colors resize-none"
                      />
                    </div>

                    {/* Authentication & SSO Integrations */}
                    <div className="pt-4 border-t border-outline-variant/20 space-y-3">
                      <span className="block text-xs font-headline-sm font-semibold text-white uppercase tracking-wider">
                        Linked Authentication Providers
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3.5 rounded-xl bg-surface-container/50 border border-outline-variant/30 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5">
                            <span className="font-bold text-white">Google SSO</span>
                            <span className="text-[11px] text-on-surface-variant font-label-code">
                              {email}
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-label-code text-[10px] font-bold">
                            Connected
                          </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-surface-container/50 border border-outline-variant/30 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5">
                            <span className="font-bold text-white">GitHub</span>
                            <span className="text-[11px] text-on-surface-variant font-label-code">
                              @aryansrivastava07
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-label-code text-[10px] font-bold">
                            Connected
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <span className="text-xs text-on-surface-variant font-label-code">
                        Last modified: Today at {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <div className="flex items-center gap-2.5 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => {
                            setFullName("Aryan Srivastava");
                            setUsername("aryan");
                            setEmail("aryasrivastavaq@gmail.com");
                          }}
                          className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-outline-variant/40 hover:bg-surface-container text-on-surface text-xs font-headline-sm transition-colors"
                        >
                          Reset Defaults
                        </button>
                        <button
                          type="submit"
                          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary-container hover:bg-primary-container/90 text-white font-headline-sm text-xs font-semibold shadow-sm border border-white/10 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-base">save</span>
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </ParallaxReveal>
            )}

            {/* TAB 2: MY QUIZZES (QUIZ CREATED) */}
            {currentTab === "my-quizzes" && (
              <ParallaxReveal direction="up" distance={25} duration={700}>
                <div className="space-y-4">
                  {/* Header & Filter Bar */}
                  <div className="rounded-2xl p-5 bg-surface-container-low/75 border border-outline-variant/30 backdrop-blur-xl shadow-lg flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1 max-w-md">
                      <div className="relative w-full">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">
                          search
                        </span>
                        <input
                          type="text"
                          value={quizSearch}
                          onChange={(e) => setQuizSearch(e.target.value)}
                          placeholder="Search your created quizzes..."
                          className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface-container-high/70 border border-outline-variant/30 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="inline-flex p-1 rounded-full bg-surface-container-high border border-outline-variant/30 text-xs font-headline-sm">
                        <button
                          type="button"
                          onClick={() => setQuizFilter("ALL")}
                          className={`px-3 py-1 rounded-full font-semibold transition-all ${
                            quizFilter === "ALL"
                              ? "bg-primary text-on-primary shadow-sm"
                              : "text-on-surface-variant hover:text-white"
                          }`}
                        >
                          All ({createdQuizzes.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuizFilter("ACTIVE")}
                          className={`px-3 py-1 rounded-full font-semibold transition-all ${
                            quizFilter === "ACTIVE"
                              ? "bg-primary text-on-primary shadow-sm"
                              : "text-on-surface-variant hover:text-white"
                          }`}
                        >
                          Active ({createdQuizzes.filter((q) => q.status === "ACTIVE").length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuizFilter("DRAFT")}
                          className={`px-3 py-1 rounded-full font-semibold transition-all ${
                            quizFilter === "DRAFT"
                              ? "bg-primary text-on-primary shadow-sm"
                              : "text-on-surface-variant hover:text-white"
                          }`}
                        >
                          Drafts ({createdQuizzes.filter((q) => q.status === "DRAFT").length})
                        </button>
                      </div>

                      <Link
                        href="/create"
                        className="px-3.5 py-1.5 rounded-full bg-primary-container hover:bg-primary-container/90 text-white font-semibold text-xs flex items-center gap-1 shadow-sm border border-white/10 active:scale-95 transition-all shrink-0"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                        <span>New Quiz</span>
                      </Link>
                    </div>
                  </div>

                  {/* Quizzes Loading State */}
                  {quizzesLoading && (
                    <div className="rounded-2xl p-12 bg-surface-container-low/75 border border-outline-variant/30 backdrop-blur-xl shadow-lg flex flex-col items-center justify-center text-center gap-3">
                      <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      <p className="font-headline-sm text-sm font-semibold text-white">
                        Loading Created Quizzes...
                      </p>
                      <p className="font-label-code text-xs text-on-surface-variant">
                        Querying database records from backend repository
                      </p>
                    </div>
                  )}

                  {/* Quizzes Error State */}
                  {!quizzesLoading && quizzesError && (
                    <div className="rounded-2xl p-6 bg-red-500/15 border border-red-500/40 backdrop-blur-xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-red-400 text-2xl shrink-0 mt-0.5">
                          error
                        </span>
                        <div>
                          <h4 className="font-headline-sm font-bold text-red-200 text-sm">
                            Failed to Load Quizzes
                          </h4>
                          <p className="font-body-md text-xs text-red-300/90 mt-0.5">
                            {quizzesError}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={loadCreatedQuizzes}
                        className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-100 font-headline-sm text-xs font-semibold shrink-0 cursor-pointer transition-colors flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-sm">refresh</span>
                        <span>Retry</span>
                      </button>
                    </div>
                  )}

                  {/* Quizzes Empty State */}
                  {!quizzesLoading && !quizzesError && filteredCreatedQuizzes.length === 0 && (
                    <div className="rounded-2xl p-12 bg-surface-container-low/75 border border-outline-variant/30 backdrop-blur-xl shadow-lg flex flex-col items-center justify-center text-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-surface-container-high/80 border border-outline-variant/40 flex items-center justify-center text-outline">
                        <span className="material-symbols-outlined text-3xl text-primary">
                          edit_document
                        </span>
                      </div>
                      <div className="max-w-md space-y-1">
                        <h3 className="font-headline-md text-base font-bold text-white">
                          {quizSearch || quizFilter !== "ALL"
                            ? "No Matching Quizzes Found"
                            : "No Quizzes Created Yet"}
                        </h3>
                        <p className="font-body-md text-xs text-on-surface-variant">
                          {quizSearch || quizFilter !== "ALL"
                            ? "No quizzes match your active search or filter criteria. Try adjusting your query."
                            : "Generate your first AI-crafted assessment from documents, topics, or custom prompts."}
                        </p>
                      </div>
                      <Link
                        href="/create"
                        className="px-5 py-2.5 rounded-xl bg-primary-container hover:bg-primary-container/90 text-white font-headline-sm text-xs font-semibold flex items-center gap-2 shadow-lg shadow-primary/20 border border-white/10 active:scale-95 transition-all"
                      >
                        <span className="material-symbols-outlined text-base">add_circle</span>
                        <span>Create New Quiz</span>
                      </Link>
                    </div>
                  )}

                  {/* Quizzes List */}
                  {!quizzesLoading && !quizzesError && filteredCreatedQuizzes.length > 0 && (
                    <div className="space-y-3">
                      {filteredCreatedQuizzes.map((quiz) => (
                        <div
                          key={quiz.id}
                          className="rounded-2xl p-5 bg-surface-container-low/75 border border-outline-variant/30 hover:border-primary/40 backdrop-blur-xl shadow-lg transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                        >
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-label-code text-[11px] px-2.5 py-0.5 rounded-full bg-surface-container-high text-tertiary border border-outline-variant/40 font-bold">
                                {quiz.id}
                              </span>
                              <span
                                className={`text-[10px] font-label-code px-2 py-0.5 rounded font-bold uppercase ${
                                  quiz.status === "ACTIVE"
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                }`}
                              >
                                {quiz.status}
                              </span>
                              <span className="text-[11px] font-label-code text-on-surface-variant">
                                {quiz.topic}
                              </span>
                            </div>

                            <h3 className="text-base sm:text-lg font-headline-sm font-bold text-white group-hover:text-primary-fixed transition-colors">
                              {quiz.title}
                            </h3>

                            <div className="flex items-center gap-4 text-xs font-label-code text-on-surface-variant pt-1 flex-wrap">
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm text-primary">
                                  quiz
                                </span>
                                <span>{quiz.questionsCount} Questions</span>
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm text-tertiary">
                                  calendar_month
                                </span>
                                <span>{quiz.date}</span>
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-outline-variant/20 font-headline-sm text-xs">
                            <Link
                              href={`/editor?quizId=${quiz.id}`}
                              className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-bright border border-outline-variant/30 text-on-surface hover:text-white flex items-center gap-1 transition-all"
                              title="Edit Questions and Choices"
                            >
                              <span className="material-symbols-outlined text-sm text-primary">
                                edit
                              </span>
                              <span>Edit</span>
                            </Link>

                            <Link
                              href={`/deploy?quizId=${quiz.id}`}
                              className="px-3.5 py-1.5 rounded-xl bg-primary-container hover:bg-primary-container/90 text-white font-semibold flex items-center gap-1 shadow-sm border border-white/10 active:scale-95 transition-all"
                              title="Deploy to Live Arena or Schedule"
                            >
                              <span className="material-symbols-outlined text-sm">
                                rocket_launch
                              </span>
                              <span>Launch Room</span>
                            </Link>

                            <Link
                              href={`/quiz?quizId=${quiz.id}`}
                              className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-bright border border-outline-variant/30 text-on-surface hover:text-white flex items-center gap-1 transition-all"
                              title="Test Run Quiz"
                            >
                              <span className="material-symbols-outlined text-sm text-emerald-400">
                                play_arrow
                              </span>
                              <span>Test</span>
                            </Link>

                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(quiz.id);
                                setToastMessage(`Quiz ID ${quiz.id} copied to clipboard!`);
                                setTimeout(() => setToastMessage(null), 2500);
                              }}
                              className="p-1.5 rounded-xl bg-surface-container hover:bg-surface-bright text-outline hover:text-on-surface transition-colors cursor-pointer"
                              title="Copy Quiz ID"
                            >
                              <span className="material-symbols-outlined text-base">
                                content_copy
                              </span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ParallaxReveal>
            )}

            {/* TAB 3: QUIZ ATTEMPTED (HISTORY & REVIEW) */}
            {currentTab === "quiz-attempted" && (
              <ParallaxReveal direction="up" distance={25} duration={700}>
                <div className="space-y-4">
                  {/* Summary Banner */}
                  <div className="rounded-2xl p-5 bg-surface-container-low/75 border border-outline-variant/30 backdrop-blur-xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-headline-lg font-bold text-white">
                        Performance &amp; Attempt History
                      </h2>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Historical telemetry, accuracy scores, and solutions breakdown for past quizzes
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-label-code">
                      <div className="bg-surface-container-high px-3 py-1.5 rounded-xl border border-outline-variant/30 text-center">
                        <span className="text-[10px] text-on-surface-variant block">TOTAL ATTEMPTS</span>
                        <span className="text-primary font-bold font-stat-counter text-sm">
                          {attemptedQuizzes.length}
                        </span>
                      </div>
                      <div className="bg-surface-container-high px-3 py-1.5 rounded-xl border border-outline-variant/30 text-center">
                        <span className="text-[10px] text-on-surface-variant block">WIN RATE</span>
                        <span className="text-emerald-400 font-bold font-stat-counter text-sm">
                          {winRate}
                        </span>
                      </div>
                      <div className="bg-surface-container-high px-3 py-1.5 rounded-xl border border-outline-variant/30 text-center">
                        <span className="text-[10px] text-on-surface-variant block">TOTAL EXP</span>
                        <span className="text-amber-accent font-bold font-stat-counter text-sm">
                          +{totalExp.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Attempts Loading State */}
                  {attemptsLoading && (
                    <div className="rounded-2xl p-12 bg-surface-container-low/75 border border-outline-variant/30 backdrop-blur-xl shadow-lg flex flex-col items-center justify-center text-center gap-3">
                      <div className="w-10 h-10 border-2 border-tertiary/30 border-t-tertiary rounded-full animate-spin" />
                      <p className="font-headline-sm text-sm font-semibold text-white">
                        Loading Cadet Telemetry...
                      </p>
                      <p className="font-label-code text-xs text-on-surface-variant">
                        Synchronizing participation history and scores from backend
                      </p>
                    </div>
                  )}

                  {/* Attempts Error State */}
                  {!attemptsLoading && attemptsError && (
                    <div className="rounded-2xl p-6 bg-red-500/15 border border-red-500/40 backdrop-blur-xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-red-400 text-2xl shrink-0 mt-0.5">
                          error
                        </span>
                        <div>
                          <h4 className="font-headline-sm font-bold text-red-200 text-sm">
                            Failed to Load Attempts
                          </h4>
                          <p className="font-body-md text-xs text-red-300/90 mt-0.5">
                            {attemptsError}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={loadAttemptedQuizzes}
                        className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-100 font-headline-sm text-xs font-semibold shrink-0 cursor-pointer transition-colors flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-sm">refresh</span>
                        <span>Retry Sync</span>
                      </button>
                    </div>
                  )}

                  {/* Attempts Empty State */}
                  {!attemptsLoading && !attemptsError && attemptedQuizzes.length === 0 && (
                    <div className="rounded-2xl p-12 bg-surface-container-low/75 border border-outline-variant/30 backdrop-blur-xl shadow-lg flex flex-col items-center justify-center text-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-surface-container-high/80 border border-outline-variant/40 flex items-center justify-center text-outline">
                        <span className="material-symbols-outlined text-3xl text-tertiary">
                          fact_check
                        </span>
                      </div>
                      <div className="max-w-md space-y-1">
                        <h3 className="font-headline-md text-base font-bold text-white">
                          No Quiz Attempts Recorded
                        </h3>
                        <p className="font-body-md text-xs text-on-surface-variant">
                          You haven't participated in any arena sessions yet. Join an active room with a game PIN or practice on your quizzes.
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Link
                          href="/join"
                          className="px-5 py-2.5 rounded-xl bg-tertiary hover:bg-tertiary/90 text-on-tertiary font-headline-sm text-xs font-semibold flex items-center gap-2 shadow-lg shadow-tertiary/20 active:scale-95 transition-all"
                        >
                          <span className="material-symbols-outlined text-base">pin</span>
                          <span>Join Arena</span>
                        </Link>
                        <Link
                          href="/create"
                          className="px-5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-bright text-white border border-outline-variant/40 font-headline-sm text-xs font-semibold flex items-center gap-2 active:scale-95 transition-all"
                        >
                          <span className="material-symbols-outlined text-base">add</span>
                          <span>Create Quiz</span>
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Attempts Cards */}
                  {!attemptsLoading && !attemptsError && attemptedQuizzes.length > 0 && (
                    <div className="space-y-3">
                      {attemptedQuizzes.map((attempt, idx) => (
                        <div
                          key={idx}
                          className="rounded-2xl p-5 bg-surface-container-low/75 border border-outline-variant/30 hover:border-tertiary/40 backdrop-blur-xl shadow-lg transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-label-code text-[11px] px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-bold">
                                {attempt.sessionCode}
                              </span>
                              <span className="text-[10px] font-label-code px-2 py-0.5 rounded bg-tertiary/15 text-tertiary font-bold uppercase border border-tertiary/25">
                                {attempt.status}
                              </span>
                              <span className="text-xs font-label-code text-on-surface-variant">
                                {attempt.date}
                              </span>
                            </div>

                            <h3 className="text-base sm:text-lg font-headline-sm font-bold text-white">
                              {attempt.title}
                            </h3>

                            <div className="flex items-center gap-4 text-xs font-label-code text-on-surface-variant pt-1 flex-wrap">
                              <span className="text-emerald-400 font-bold">
                                Score: {attempt.scorePct} ({attempt.correctAnswers})
                              </span>
                              <span>•</span>
                              <span className="text-amber-accent font-semibold">
                                +{attempt.xpEarned} XP
                              </span>
                              <span>•</span>
                              <span>{attempt.rank}</span>
                              <span>•</span>
                              <span>Duration: {attempt.timeSpent}</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-outline-variant/20">
                            {attempt.quizId && (
                              <Link
                                href={`/quiz?quizId=${attempt.quizId}`}
                                className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-bright border border-outline-variant/40 text-on-surface hover:text-white text-xs font-headline-sm flex items-center gap-1.5 transition-all active:scale-95"
                              >
                                <span className="material-symbols-outlined text-sm text-emerald-400">
                                  replay
                                </span>
                                <span>Retake</span>
                              </Link>
                            )}
                            <Link
                              href={attempt.quizId ? `/results?quizId=${attempt.quizId}` : "/results"}
                              className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-bright border border-outline-variant/40 hover:border-tertiary text-on-surface hover:text-white text-xs font-headline-sm flex items-center gap-1.5 transition-all active:scale-95"
                            >
                              <span className="material-symbols-outlined text-sm text-tertiary">
                                fact_check
                              </span>
                              <span>Review Solutions</span>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ParallaxReveal>
            )}

            {/* TAB 4: FAQS */}
            {currentTab === "faqs" && (
              <ParallaxReveal direction="up" distance={25} duration={700}>
                <div className="space-y-4">
                  {/* FAQs Header & Search */}
                  <div className="rounded-2xl p-6 bg-surface-container-low/75 border border-outline-variant/30 backdrop-blur-xl shadow-lg space-y-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-headline-lg font-bold text-white">
                        Frequently Asked Questions
                      </h2>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Clear answers to common questions about quiz creation, live arena competitions, and anti-cheat policies
                      </p>
                    </div>

                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-base">
                        search
                      </span>
                      <input
                        type="text"
                        value={faqSearch}
                        onChange={(e) => setFaqSearch(e.target.value)}
                        placeholder="Search answers (e.g. anti-cheat, PDF ingestion, XP calculation)..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-high/70 border border-outline-variant/30 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
                      />
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs font-headline-sm">
                      {[
                        "All",
                        "Creating Quizzes",
                        "Hosting & Arena",
                        "Scoring & Anti-Cheat",
                        "Account & Access",
                      ].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setFaqCategory(cat)}
                          className={`px-3 py-1 rounded-full border transition-all ${
                            faqCategory === cat
                              ? "bg-primary text-on-primary border-primary font-semibold shadow-sm"
                              : "bg-surface-container/60 border-outline-variant/30 text-on-surface-variant hover:text-white"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Accordion List */}
                  <div className="space-y-3">
                    {filteredFaqs.map((faq, idx) => {
                      const isOpen = openFaqIndex === idx;
                      return (
                        <div
                          key={idx}
                          className={`rounded-2xl border transition-all overflow-hidden backdrop-blur-xl ${
                            isOpen
                              ? "bg-surface-container-low/90 border-primary/50 shadow-lg shadow-primary/10"
                              : "bg-surface-container-low/60 border-outline-variant/30 hover:border-outline-variant/60"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                            className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-3 cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-lg bg-surface-container-high text-primary flex items-center justify-center font-label-code text-xs font-bold shrink-0">
                                {idx + 1}
                              </span>
                              <h4 className="text-sm sm:text-base font-headline-sm font-semibold text-white">
                                {faq.q}
                              </h4>
                            </div>
                            <span
                              className={`material-symbols-outlined text-outline text-lg transform transition-transform duration-200 ${
                                isOpen ? "rotate-180 text-primary" : ""
                              }`}
                            >
                              expand_more
                            </span>
                          </button>

                          {isOpen && (
                            <div className="px-5 pb-5 pt-1 border-t border-outline-variant/20 text-xs sm:text-sm text-on-surface-variant leading-relaxed font-body-md animate-fadeIn">
                              <p>{faq.a}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ParallaxReveal>
            )}

            {/* TAB 5: CONTACT SUPPORT */}
            {currentTab === "contact-support" && (
              <ParallaxReveal direction="up" distance={25} duration={700}>
                <div className="rounded-2xl p-6 sm:p-8 bg-surface-container-low/75 border border-outline-variant/30 backdrop-blur-2xl shadow-2xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-outline-variant/20">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-headline-lg font-bold text-white">
                        Contact Support &amp; Help Desk
                      </h2>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Need immediate assistance with a live exam or bespoke AI integration? Submit a priority ticket below.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 font-label-code text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/30">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>SLA Response: &lt; 15 Mins</span>
                    </div>
                  </div>

                  {ticketSubmittedId ? (
                    <div className="p-8 rounded-2xl bg-surface-container/70 border border-primary/40 text-center space-y-4">
                      <div className="w-14 h-14 rounded-2xl bg-primary-container/30 border border-primary/50 text-primary flex items-center justify-center mx-auto text-3xl">
                        <span className="material-symbols-outlined text-3xl">mark_email_read</span>
                      </div>
                      <h3 className="text-xl font-headline-lg font-bold text-white">
                        Ticket Successfully Dispatched!
                      </h3>
                      <p className="text-xs text-on-surface-variant max-w-md mx-auto">
                        Your inquiry has been assigned reference ticket ID{" "}
                        <strong className="text-primary font-label-code">
                          {ticketSubmittedId}
                        </strong>
                        . An engineer has been paged and will respond to{" "}
                        <span className="text-white">{email}</span> within 15 minutes.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setTicketSubmittedId(null);
                          setTicketSubject("");
                          setTicketMessage("");
                        }}
                        className="px-5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-bright text-xs font-headline-sm text-white transition-colors"
                      >
                        Submit Another Inquiry
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleTicketSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Category */}
                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-white uppercase tracking-wider font-headline-sm">
                            Inquiry Category
                          </label>
                          <select
                            value={ticketCategory}
                            onChange={(e) => setTicketCategory(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container/60 border border-outline-variant/40 text-on-surface text-xs focus:outline-none focus:border-primary cursor-pointer"
                          >
                            <option>Technical &amp; Live Arena</option>
                            <option>Document Ingestion &amp; PDF OCR</option>
                            <option>Account, SSO &amp; Academic License</option>
                            <option>Feature Request / Custom Integration</option>
                          </select>
                        </div>

                        {/* Urgency */}
                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-white uppercase tracking-wider font-headline-sm">
                            Priority Urgency
                          </label>
                          <select
                            value={ticketUrgency}
                            onChange={(e) => setTicketUrgency(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container/60 border border-outline-variant/40 text-on-surface text-xs focus:outline-none focus:border-primary cursor-pointer"
                          >
                            <option>Normal (Standard SLA &lt; 2h)</option>
                            <option>High (Academic Class Upcoming)</option>
                            <option>Critical (Live Exam Room In Progress)</option>
                          </select>
                        </div>
                      </div>

                      {/* Subject */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-white uppercase tracking-wider font-headline-sm">
                          Subject Statement
                        </label>
                        <input
                          type="text"
                          required
                          value={ticketSubject}
                          onChange={(e) => setTicketSubject(e.target.value)}
                          placeholder="e.g. Question generation stalled on 45MB Quantum Electrodynamics PDF"
                          className="w-full px-4 py-2.5 rounded-xl bg-surface-container/60 border border-outline-variant/40 text-on-surface text-xs focus:outline-none focus:border-primary transition-colors"
                        />
                      </div>

                      {/* Message */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-white uppercase tracking-wider font-headline-sm">
                          Detailed Description
                        </label>
                        <textarea
                          rows={4}
                          required
                          value={ticketMessage}
                          onChange={(e) => setTicketMessage(e.target.value)}
                          placeholder="Provide details of the behavior encountered, room PIN or quiz ID if applicable..."
                          className="w-full p-3.5 rounded-xl bg-surface-container/60 border border-outline-variant/40 text-on-surface text-xs focus:outline-none focus:border-primary transition-colors resize-none"
                        />
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-4 text-xs font-label-code text-on-surface-variant">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm text-tertiary">
                              verified_user
                            </span>
                            <span>Encrypted Diagnostic Stream</span>
                          </span>
                        </div>

                        <button
                          type="submit"
                          className="w-full sm:w-auto px-7 py-2.5 rounded-xl bg-primary-container hover:bg-primary-container/90 text-white font-headline-sm text-xs font-semibold shadow-sm border border-white/10 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-base">send</span>
                          <span>Dispatch Priority Ticket</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Direct Contact Alternatives */}
                  <div className="pt-4 border-t border-outline-variant/20 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-surface-container/40 border border-outline-variant/30 flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-primary text-xl">forum</span>
                      <div>
                        <span className="block font-semibold text-white">Discord Guild</span>
                        <span className="text-[11px] text-on-surface-variant font-label-code">
                          4,200+ active educators
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-surface-container/40 border border-outline-variant/30 flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-tertiary text-xl">mail</span>
                      <div>
                        <span className="block font-semibold text-white">Direct Email</span>
                        <span className="text-[11px] text-on-surface-variant font-label-code">
                          support@quizzcraft.app
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-surface-container/40 border border-outline-variant/30 flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-emerald-400 text-xl">
                        hub
                      </span>
                      <div>
                        <span className="block font-semibold text-white">Cluster Telemetry</span>
                        <span className="text-[11px] text-emerald-400 font-label-code">
                          100% Operational
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </ParallaxReveal>
            )}

            {/* TAB 6: NOTIFICATIONS */}
            {currentTab === "notifications" && (
              <ParallaxReveal direction="up" distance={25} duration={700}>
                <div className="rounded-2xl p-6 sm:p-8 bg-surface-container-low/75 border border-outline-variant/30 backdrop-blur-2xl shadow-2xl space-y-5">
                  <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-headline-lg font-bold text-white">
                        Notification Preferences
                      </h2>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Configure dispatch channels for real-time arena invites and student milestone telemetry
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-4 rounded-xl bg-surface-container/50 border border-outline-variant/30 flex items-center justify-between">
                      <div>
                        <span className="block font-semibold text-white text-sm">
                          Live Arena Host Invitations
                        </span>
                        <span className="text-on-surface-variant">
                          Receive instant push notifications when a synchronous quiz room commences
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-outline-variant/60 bg-surface-container text-primary w-4 h-4"
                      />
                    </div>

                    <div className="p-4 rounded-xl bg-surface-container/50 border border-outline-variant/30 flex items-center justify-between">
                      <div>
                        <span className="block font-semibold text-white text-sm">
                          Leaderboard Surge Alerts
                        </span>
                        <span className="text-on-surface-variant">
                          Notify when a cohort cadet exceeds your high score in any published room
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-outline-variant/60 bg-surface-container text-primary w-4 h-4"
                      />
                    </div>

                    <div className="p-4 rounded-xl bg-surface-container/50 border border-outline-variant/30 flex items-center justify-between">
                      <div>
                        <span className="block font-semibold text-white text-sm">
                          Weekly Pedagogical Digest
                        </span>
                        <span className="text-on-surface-variant">
                          Summary of student retention curves, difficult questions, and quiz completions
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-outline-variant/60 bg-surface-container text-primary w-4 h-4"
                      />
                    </div>
                  </div>
                </div>
              </ParallaxReveal>
            )}

            {/* TAB 7: SETTINGS */}
            {currentTab === "settings" && (
              <ParallaxReveal direction="up" distance={25} duration={700}>
                <div className="rounded-2xl p-6 sm:p-8 bg-surface-container-low/75 border border-outline-variant/30 backdrop-blur-2xl shadow-2xl space-y-5">
                  <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-headline-lg font-bold text-white">
                        Platform Preferences &amp; Accessibility
                      </h2>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Customize visual fidelity, 3D card perspective damping, and audio haptics
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-4 rounded-xl bg-surface-container/50 border border-outline-variant/30 flex items-center justify-between">
                      <div>
                        <span className="block font-semibold text-white text-sm">
                          Cosmic Starfield &amp; Parallax Intensity
                        </span>
                        <span className="text-on-surface-variant">
                          Enable multi-layer GPU cosmic particle drift on cursor and scroll motion
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-outline-variant/60 bg-surface-container text-primary w-4 h-4"
                      />
                    </div>

                    <div className="p-4 rounded-xl bg-surface-container/50 border border-outline-variant/30 flex items-center justify-between">
                      <div>
                        <span className="block font-semibold text-white text-sm">
                          High Contrast Accessibility
                        </span>
                        <span className="text-on-surface-variant">
                          Boost typography border outlines and darken card backgrounds for enhanced readability
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        className="rounded border-outline-variant/60 bg-surface-container text-primary w-4 h-4"
                      />
                    </div>

                    <div className="p-4 rounded-xl bg-surface-container/50 border border-outline-variant/30 flex items-center justify-between">
                      <div>
                        <span className="block font-semibold text-white text-sm">
                          Kiosk Fullscreen Auto-Lock
                        </span>
                        <span className="text-on-surface-variant">
                          Enforce browser kiosk mode automatically upon joining any competitive exam
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-outline-variant/60 bg-surface-container text-primary w-4 h-4"
                      />
                    </div>
                  </div>
                </div>
              </ParallaxReveal>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-lowest/80 backdrop-blur-md border-t border-outline-variant/20 py-5 px-6 relative z-10 text-xs font-label-code text-on-surface-variant">
        <div className="max-w-max-width-canvas mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <span>QuizzCraft.app • Spatial Learning Engine Profile Portal</span>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/create" className="hover:text-primary transition-colors">
              Create Quiz
            </Link>
            <Link href="/join" className="hover:text-primary transition-colors">
              Join Arena
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-surface text-on-surface">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin">
              progress_activity
            </span>
          </div>
        }
      >
        <ProfileContent />
      </Suspense>
    </ProtectedRoute>
  );
}
