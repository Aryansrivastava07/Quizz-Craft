"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import CosmicCanvas from "@/components/canvas/CosmicCanvas";
import ParallaxReveal from "@/components/ui/ParallaxReveal";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { quizService } from "@/lib/api/quiz-service";
import { profileService } from "@/lib/api/profile-service";

interface QuestionOption {
  key: string;
  text: string;
  num: string;
  isCorrect: boolean;
}

interface ActiveQuizQuestion {
  id: number;
  questionId: string;
  section: string;
  statement: string;
  level: "EASY" | "MEDIUM" | "HARD";
  xp: number;
  options: QuestionOption[];
  correctKey: string;
  correctText: string;
  explanation: string;
  visualCaption?: string;
}

function isCorrectOption(optText: string, optIdx: number, rawAnswer: any): boolean {
  if (rawAnswer === undefined || rawAnswer === null) return false;
  const ansStr = String(rawAnswer).trim();
  const key = ["A", "B", "C", "D", "E"][optIdx] || "";
  if (ansStr === String(optIdx)) return true;
  if (ansStr.toUpperCase() === key.toUpperCase()) return true;
  if (ansStr.toLowerCase() === optText.trim().toLowerCase()) return true;
  return false;
}

function ActiveQuizPlatformContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizIdParam = searchParams.get("quizId");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [quizId, setQuizId] = useState<string | null>(null);
  const [quizTitle, setQuizTitle] = useState("Quantum Computing Principles");
  const [immediateResult, setImmediateResult] = useState(true);
  const [temporalLimit, setTemporalLimit] = useState(true);
  const [questime, setQuestime] = useState(60);
  const [questions, setQuestions] = useState<ActiveQuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  // Map of question id (1-based) to answer details
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, { key: string; text: string; isCorrect: boolean }>
  >({});
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600);
  const [markedQuestions, setMarkedQuestions] = useState<number[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load Quiz Data from Backend API
  useEffect(() => {
    let isMounted = true;

    async function loadQuizData() {
      setIsLoading(true);
      setError(null);

      try {
        let targetQuizId = quizIdParam;

        // If no quizId in URL parameters, attempt to locate user's latest quiz
        if (!targetQuizId) {
          try {
            const userQuizzesRes = await profileService.getQuizzes();
            const userQuizzes = userQuizzesRes.data?.quizzes;
            if (userQuizzes && userQuizzes.length > 0) {
              targetQuizId = userQuizzes[0].quizId;
            }
          } catch (e) {
            console.warn("Could not query user quizzes fallback:", e);
          }
        }

        if (!targetQuizId) {
          setError(
            "No quiz target specified. Please select a quiz from your mission dashboard or enter a live room code."
          );
          setIsLoading(false);
          return;
        }

        const res = await quizService.getQuiz(targetQuizId);
        if (!isMounted) return;

        if (!res.data?.quiz) {
          setError("Failed to load quiz telemetry from database.");
          setIsLoading(false);
          return;
        }

        const fetchedQuiz = res.data.quiz;
        setQuizTitle(fetchedQuiz.title || "Quantum Computing Principles");
        setQuizId(fetchedQuiz.quizId);
        // Accommodate immediateResult, temporalLimit, questime, and dynamicShuffle columns from database
        setImmediateResult(fetchedQuiz.immediateResult !== false);
        const hasTemporalLimit = fetchedQuiz.temporalLimit !== false;
        setTemporalLimit(hasTemporalLimit);
        const qTime = fetchedQuiz.questime || 60;
        setQuestime(qTime);
        const shouldShuffle = fetchedQuiz.dynamicShuffle !== false;

        const backendQuestions = fetchedQuiz.questions || [];
        if (backendQuestions.length === 0) {
          setError("This quiz currently contains no verified questions.");
          setIsLoading(false);
          return;
        }

        const mapped: ActiveQuizQuestion[] = backendQuestions.map((q, idx) => {
          const rawLevel = (q.level || "MEDIUM").toUpperCase();
          const level: "EASY" | "MEDIUM" | "HARD" =
            rawLevel === "EASY" ? "EASY" : rawLevel === "HARD" ? "HARD" : "MEDIUM";
          // Fixed XP calculation based on difficulty level
          const xp = level === "EASY" ? 100 : level === "HARD" ? 300 : 200;
          const explanation = q.explanation || "";

          const rawOptions = Array.isArray(q.options) ? q.options : [];
          let options: QuestionOption[] = rawOptions.map((opt: any, optIdx: number) => {
            const key = ["A", "B", "C", "D", "E"][optIdx] || String(optIdx + 1);
            const text = typeof opt === "string" ? opt : opt.text || "";
            const isCorrect = isCorrectOption(text, optIdx, q.answer);
            return {
              key,
              text,
              num: String(optIdx + 1),
              isCorrect,
            };
          });

          // Dynamic Shuffle: Randomize option ordering while preserving keys and correct mapping
          if (shouldShuffle && options.length > 1) {
            for (let i = options.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [options[i], options[j]] = [options[j], options[i]];
            }
            options.forEach((opt, oIdx) => {
              opt.key = ["A", "B", "C", "D", "E"][oIdx] || String(oIdx + 1);
              opt.num = String(oIdx + 1);
            });
          }

          const correctOpt = options.find((o) => o.isCorrect);

          return {
            id: idx + 1,
            questionId: q.questionId || `q-${idx + 1}`,
            section: `MODULE ${(idx + 1).toString().padStart(2, "0")} // LEVEL: ${level}`,
            statement: q.question || "",
            level,
            xp,
            options,
            correctKey: correctOpt?.key || "A",
            correctText: correctOpt?.text || String(q.answer || ""),
            explanation,
            visualCaption: `Fig ${(idx + 1).toString().padStart(2, "0")} — State Vector Telemetry & Neural Topology`,
          };
        });

        setQuestions(mapped);
        setCurrentIdx(0);
        setSelectedAnswers({});
        setScore(0);
        setStreak(0);
        setTimeLeft(hasTemporalLimit ? mapped.length * qTime : 99999);

        // Establish an attempt session in backend
        try {
          const attemptRes = await quizService.createAttempt(targetQuizId);
          const session = attemptRes.data?.session || attemptRes.data?.createSession;
          if (session?.sessionId) {
            setSessionId(session.sessionId);
          }
        } catch (attemptErr) {
          console.warn("Attempt session sync initialized in client mode:", attemptErr);
        }
      } catch (err: any) {
        console.error("Quiz loading error:", err);
        setError(err?.message || "Failed to load quiz telemetry.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadQuizData();

    return () => {
      isMounted = false;
    };
  }, [quizIdParam]);

  // Live countdown timer (active only when temporalLimit is enabled)
  useEffect(() => {
    if (!temporalLimit) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [temporalLimit]);

  const formatTime = (seconds: number) => {
    if (!temporalLimit) return "∞";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const currentQ = questions[currentIdx];
  const userSelection = currentQ ? selectedAnswers[currentQ.id] : undefined;

  const handleSelectAnswer = async (key: string, optionText: string, isCorrect: boolean) => {
    if (!currentQ) return;

    // If immediateResult is enabled and user already answered, lock selection
    if (immediateResult && selectedAnswers[currentQ.id]) {
      return;
    }

    const wasAlreadyAnswered = Boolean(selectedAnswers[currentQ.id]);

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: { key, text: optionText, isCorrect },
    }));

    if (immediateResult && !wasAlreadyAnswered) {
      if (isCorrect) {
        setStreak((prev) => prev + 1);
        setScore((prev) => prev + currentQ.xp);
      } else {
        setStreak(0);
      }
    }

    // Telemetry update to backend
    if (sessionId) {
      try {
        await quizService.updateAnswer(sessionId, {
          questionId: currentQ.questionId,
          option: optionText,
        });
      } catch (err) {
        console.warn("Answer sync error:", err);
      }
    }
  };

  const handleToggleMark = () => {
    if (!currentQ) return;
    setMarkedQuestions((prev) =>
      prev.includes(currentQ.id)
        ? prev.filter((id) => id !== currentQ.id)
        : [...prev, currentQ.id]
    );
  };

  const handleNext = async () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Completed all questions — submit attempt
      setIsSubmitting(true);
      try {
        if (sessionId && currentQ) {
          const finalChoice = selectedAnswers[currentQ.id]?.text || "";
          await quizService.submitAttempt(sessionId, {
            questionId: currentQ.questionId,
            option: finalChoice,
          });
        }
      } catch (err) {
        console.error("Submission error:", err);
      } finally {
        setIsSubmitting(false);
        router.push(
          `/results?quizId=${quizId || ""}&sessionId=${sessionId || ""}&score=${score}&total=${questions.length}`
        );
      }
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen text-on-surface flex flex-col justify-between relative overflow-hidden">
        <CosmicCanvas />
        <div className="relative z-10 flex-1 flex items-center justify-center p-4">
          <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest/90 backdrop-blur-2xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary-container/20 border border-primary/40 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl animate-spin">
                progress_activity
              </span>
            </div>
            <h3 className="font-headline-lg text-lg font-bold mb-2">
              Synthesizing Mission Telemetry
            </h3>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Loading verified question set and calibrating active session parameters...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || questions.length === 0 || !currentQ) {
    return (
      <div className="min-h-screen text-on-surface flex flex-col justify-between relative overflow-hidden">
        <CosmicCanvas />
        <div className="relative z-10 flex-1 flex items-center justify-center p-4">
          <div className="rounded-2xl border border-rose-500/30 bg-surface-container-lowest/90 backdrop-blur-2xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <span className="material-symbols-outlined text-2xl">
                warning
              </span>
            </div>
            <h3 className="font-headline-lg text-lg font-bold mb-2">
              Quiz Unavailable
            </h3>
            <p className="font-body-sm text-xs text-on-surface-variant mb-6 leading-relaxed">
              {error || "Unable to retrieve question set for this quiz."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/profile"
                className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container border border-outline-variant/30 text-xs font-semibold transition-colors"
              >
                Mission Library
              </Link>
              <Link
                href="/create"
                className="px-4 py-2 rounded-xl bg-primary-container hover:bg-primary-container/90 text-white text-xs font-semibold transition-colors"
              >
                Create New Quiz
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPct = (answeredCount / Math.max(1, questions.length)) * 100;

  return (
    <div className="min-h-screen text-on-surface font-body-md flex flex-col justify-between selection:bg-primary-container selection:text-on-primary relative overflow-x-hidden antialiased">
      {/* Universal Cosmic Starfield Canvas */}
      <CosmicCanvas />

      {/* Top HUD Bar */}
      <header className="relative z-20 w-full pt-4 pb-2 px-4 sm:px-8 border-b border-outline-variant/20 bg-surface-container-lowest/80 backdrop-blur-xl">
        <div className="max-w-max-width-canvas mx-auto flex items-center justify-between gap-4">
          {/* Left: Brand Identity & Exam Title */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-on-surface hover:opacity-90 transition-opacity"
            >
              <div className="w-8 h-8 rounded-lg bg-surface-container-high border border-outline-variant/40 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-lg">bolt</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-code text-xs text-primary font-bold tracking-wide">
                  QuizzCraft // ARENA
                </span>
                <span className="font-headline-sm text-xs text-on-surface font-semibold hidden sm:inline max-w-xs truncate">
                  {quizTitle}
                </span>
              </div>
            </Link>
          </div>

          {/* Right: Telemetry & Controls */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs font-label-code">
            {/* Multiplier / Streak */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/30 text-primary-fixed border border-primary/30">
              <span className="material-symbols-outlined text-sm text-tertiary">
                electric_bolt
              </span>
              <span>{streak}x Streak (+{streak * 25} XP)</span>
            </div>

            {/* Score Pill */}
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/40 text-tertiary font-bold">
              <span className="material-symbols-outlined text-xs">stars</span>
              <span>{score} XP</span>
            </div>

            {/* Question Counter Pill */}
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/40">
              <span className="text-on-surface-variant">Question</span>
              <span className="text-primary font-bold text-sm">
                {(currentQ.id).toString().padStart(2, "0")}
              </span>
              <span className="text-on-surface-variant">/ {questions.length.toString().padStart(2, "0")}</span>
            </div>

            {/* Timer Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low border border-primary-container/40 text-on-surface">
              <span className="material-symbols-outlined text-primary text-base">timer</span>
              <span className="text-primary font-bold tracking-wider text-sm">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>

        {/* Precision Progress Bar */}
        <div className="max-w-max-width-canvas mx-auto w-full mt-3">
          <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden relative shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-tertiary via-primary to-primary-container rounded-full relative transition-all duration-500 ease-out shadow-[0_0_12px_rgba(160,120,255,0.8)]"
              style={{ width: `${Math.max(progressPct, 4)}%` }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full blur-[1px] opacity-80" />
            </div>
          </div>
          <div className="flex justify-between items-center mt-1 px-1 font-label-code text-[11px] text-on-surface-variant">
            <span>Session Progress</span>
            <span className="text-tertiary">
              {Math.round(progressPct)}% Complete ({answeredCount}/{questions.length})
            </span>
          </div>
        </div>
      </header>

      {/* Main Question Cockpit */}
      <main className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-8 py-6 max-w-max-width-canvas w-full mx-auto">
        <ParallaxReveal direction="up" distance={20} duration={650} className="w-full">
          <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest/80 backdrop-blur-2xl p-5 sm:p-8 shadow-2xl transition-all duration-300">
            {/* Card Meta & Mark Bookmark */}
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3 mb-4">
              <div className="flex items-center gap-2 text-xs font-label-code text-on-surface-variant">
                <span>
                  Question {currentQ.id} of {questions.length}
                </span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded bg-surface-container-high border border-outline-variant/40 text-primary-fixed font-bold">
                  {currentQ.level}
                </span>
                <span>•</span>
                <span className="text-tertiary">+{currentQ.xp} XP</span>
              </div>
              <button
                onClick={handleToggleMark}
                className={`flex items-center gap-1 text-xs font-label-code transition-colors ${
                  markedQuestions.includes(currentQ.id)
                    ? "text-amber-accent font-bold"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {markedQuestions.includes(currentQ.id) ? "bookmark_added" : "bookmark"}
                </span>
                <span className="hidden sm:inline">
                  {markedQuestions.includes(currentQ.id) ? "Marked for Review" : "Mark for Review"}
                </span>
              </button>
            </div>

            {/* Question Text */}
            <div className="mb-6">
              <h2 className="text-lg sm:text-2xl font-headline-lg text-on-surface font-semibold leading-relaxed tracking-tight">
                {currentQ.statement}
              </h2>
            </div>

            {/* Center Grid: Visual Schematic & Choices */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Reference Visual & Mode Telemetry */}
              <div className="lg:col-span-5 flex flex-col gap-3">
                <div className="relative rounded-xl overflow-hidden border border-outline-variant/30 bg-surface-container-low group shadow-lg">
                  <div className="aspect-video sm:aspect-square w-full relative overflow-hidden bg-surface-container-lowest flex items-center justify-center">
                    <img
                      alt="Quantum circuit and neural topology visualization"
                      className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500 opacity-90 hover:opacity-100"
                      src="/stitch/screen-6-cosmic-portal-3d.png"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent pointer-events-none" />

                    {/* Telemetry chip */}
                    <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded bg-surface-container-lowest/85 backdrop-blur-md border border-outline-variant/30 font-label-code text-[11px] text-tertiary flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
                      <span>Level: {currentQ.level} ({currentQ.xp} XP)</span>
                    </div>
                  </div>

                  <div className="p-2.5 border-t border-outline-variant/20 bg-surface-container-low/70 flex items-center justify-between text-xs">
                    <p className="font-body-sm text-[11px] text-on-surface-variant italic">
                      {currentQ.visualCaption || `Fig ${currentQ.id} — State Vector Telemetry`}
                    </p>
                    <span className="font-label-code text-[10px] text-outline uppercase tracking-wider">
                      Verified
                    </span>
                  </div>
                </div>

                {/* Immediate Result Feedback Mode pill */}
                <div className="p-3 rounded-xl bg-surface-container-high/40 border border-outline-variant/20 flex items-center justify-between text-xs font-label-code">
                  <span className="text-on-surface-variant">Feedback Mode:</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                      immediateResult
                        ? "bg-tertiary/20 text-tertiary border border-tertiary/40"
                        : "bg-surface-container-high text-on-surface-variant border border-outline-variant/40"
                    }`}
                  >
                    {immediateResult ? "Immediate Result Active" : "Standard Exam Mode"}
                  </span>
                </div>
              </div>

              {/* Right: Interactive Options List */}
              <div className="lg:col-span-7 flex flex-col gap-3">
                {currentQ.options.map((opt) => {
                  const isSelected = userSelection?.key === opt.key;

                  let optionStyle =
                    "border border-outline-variant/30 bg-surface-container-low/60 hover:bg-surface-container/70 hover:border-outline-variant/60";
                  let badgeStyle =
                    "bg-surface-container-high border border-outline-variant/40 text-on-surface-variant group-hover:text-primary group-hover:border-primary";
                  let indicatorIcon = null;

                  if (immediateResult && userSelection) {
                    if (opt.isCorrect) {
                      optionStyle =
                        "border-2 border-emerald-500/90 bg-emerald-950/40 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.25)] ring-1 ring-emerald-400/40";
                      badgeStyle = "bg-emerald-500 text-white font-bold";
                      indicatorIcon = (
                        <span className="material-symbols-outlined text-xs font-bold text-emerald-400">
                          check
                        </span>
                      );
                    } else if (isSelected && !opt.isCorrect) {
                      optionStyle =
                        "border-2 border-rose-500/90 bg-rose-950/40 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.25)] ring-1 ring-rose-400/40";
                      badgeStyle = "bg-rose-500 text-white font-bold";
                      indicatorIcon = (
                        <span className="material-symbols-outlined text-xs font-bold text-rose-400">
                          close
                        </span>
                      );
                    } else {
                      optionStyle = "opacity-50 border border-outline-variant/20 bg-surface-container-low/30";
                    }
                  } else if (isSelected) {
                    optionStyle =
                      "border-2 border-primary-container bg-surface-container-high/90 shadow-[0_0_25px_-5px_rgba(160,120,255,0.45),0_0_10px_rgba(76,215,246,0.25)] ring-1 ring-tertiary/40";
                    badgeStyle = "bg-primary text-on-primary shadow-md";
                    indicatorIcon = (
                      <span className="material-symbols-outlined text-xs font-bold text-white">
                        check
                      </span>
                    );
                  }

                  return (
                    <button
                      key={opt.key}
                      type="button"
                      disabled={immediateResult && Boolean(userSelection)}
                      onClick={() => handleSelectAnswer(opt.key, opt.text, opt.isCorrect)}
                      className={`w-full text-left rounded-xl p-4 transition-all duration-200 group flex items-start gap-3 relative overflow-hidden active:scale-[0.99] cursor-pointer disabled:cursor-default ${optionStyle}`}
                    >
                      {/* Key Letter Badge */}
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-lg font-headline-sm text-xs font-bold flex items-center justify-center transition-colors ${badgeStyle}`}
                      >
                        {opt.key}
                      </div>

                      {/* Statement */}
                      <div className="flex-1 pt-0.5">
                        <p
                          className={`text-xs sm:text-sm leading-relaxed ${
                            isSelected ? "text-on-surface font-medium" : "text-on-surface"
                          }`}
                        >
                          {opt.text}
                        </p>
                      </div>

                      {/* Indicator */}
                      <div className="flex-shrink-0 flex items-center gap-2 self-center">
                        <span className="font-label-code text-[11px] text-outline">
                          [{opt.num}]
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                            isSelected
                              ? "bg-primary-container text-white shadow-[0_0_8px_rgba(160,120,255,0.8)]"
                              : "border-2 border-outline-variant group-hover:border-outline"
                          }`}
                        >
                          {indicatorIcon}
                        </div>
                      </div>

                      {/* Side highlight stripe */}
                      {isSelected && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-tertiary to-primary-container" />
                      )}
                    </button>
                  );
                })}

                {/* Immediate Result Explanation Box */}
                {immediateResult && userSelection && (
                  <div
                    className={`rounded-xl p-4 border mt-2 transition-all duration-300 ${
                      userSelection.isCorrect
                        ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-100"
                        : "bg-surface-container-high/90 border-primary/30 text-on-surface"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-outline-variant/20">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base text-tertiary">
                          {userSelection.isCorrect ? "verified" : "lightbulb"}
                        </span>
                        <span className="font-label-code text-xs font-bold uppercase tracking-wider text-tertiary">
                          Explanation
                        </span>
                      </div>
                      <span
                        className={`text-[11px] font-label-code px-2 py-0.5 rounded-full font-bold ${
                          userSelection.isCorrect
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                            : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                        }`}
                      >
                        {userSelection.isCorrect
                          ? `+${currentQ.xp} XP AWARDED`
                          : "INCORRECT CALIBRATION"}
                      </span>
                    </div>
                    <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                      {currentQ.explanation || "No explanation recorded for this question."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ParallaxReveal>
      </main>

      {/* Bottom Control Bar */}
      <footer className="relative z-20 w-full pb-6 pt-2 px-4 sm:px-8">
        <div className="max-w-max-width-canvas mx-auto bg-surface-container-low/85 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-3 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl">
          {/* Left: Prev Button & Flag */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-surface-container border border-outline-variant/30 hover:border-outline text-on-surface font-headline-sm text-xs transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              <span>Previous</span>
            </button>

            <button
              type="button"
              onClick={handleToggleMark}
              className="flex items-center gap-1 text-xs font-label-code text-on-surface-variant hover:text-on-surface cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">flag</span>
              <span className="hidden sm:inline">Flag Question</span>
            </button>
          </div>

          {/* Center: Dynamic Question Jumper Matrix */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-2 font-label-code text-xs max-w-xs sm:max-w-md">
            {questions.map((q, idx) => {
              const isDone = Boolean(selectedAnswers[q.id]);
              const isCurrent = idx === currentIdx;
              const isFlagged = markedQuestions.includes(q.id);
              const answer = selectedAnswers[q.id];

              let btnColor =
                "bg-surface-container border border-outline-variant/30 text-outline hover:text-on-surface";

              if (isCurrent) {
                btnColor =
                  "bg-primary text-on-primary shadow-md shadow-primary/30 ring-2 ring-tertiary scale-110";
              } else if (isDone) {
                if (immediateResult) {
                  btnColor = answer?.isCorrect
                    ? "bg-emerald-950/60 border border-emerald-500/60 text-emerald-400"
                    : "bg-rose-950/60 border border-rose-500/60 text-rose-400";
                } else {
                  btnColor = "bg-surface-container-high border border-tertiary/40 text-tertiary";
                }
              }

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-7 h-7 flex-shrink-0 rounded-lg font-bold flex items-center justify-center transition-all relative cursor-pointer ${btnColor}`}
                >
                  {q.id}
                  {isFlagged && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Submit & Next Question Button */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleNext}
              className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-primary-container hover:bg-primary-container/90 text-white font-headline-sm text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 shadow-sm border border-white/10 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <span>
                {currentIdx === questions.length - 1
                  ? isSubmitting
                    ? "Submitting Telemetry..."
                    : "Submit & View Results"
                  : "Next Question"}
              </span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function ActiveQuizPlatformPage() {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <div className="min-h-screen relative flex items-center justify-center bg-surface text-on-surface">
            <div className="w-10 h-10 rounded-xl bg-primary-container/20 border border-primary/40 flex items-center justify-center text-primary animate-pulse">
              <span className="material-symbols-outlined text-2xl animate-spin">
                progress_activity
              </span>
            </div>
          </div>
        }
      >
        <ActiveQuizPlatformContent />
      </Suspense>
    </ProtectedRoute>
  );
}
