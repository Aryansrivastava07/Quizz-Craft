"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import CosmicCanvas from "@/components/canvas/CosmicCanvas";
import Navbar from "@/components/layout/Navbar";
import ParallaxReveal from "@/components/ui/ParallaxReveal";
import { quizService } from "@/lib/api/quiz-service";
import { formatApiError } from "@/lib/api/client";
import { Quiz, QuizQuestion as BackendQuizQuestion } from "@/lib/api/types";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

interface Question {
  id: number;
  questionId?: string;
  question: string;
  type: string;
  xp: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  options: { text: string; correct: boolean; letter: string }[];
  explanation: string;
  hasVisual?: boolean;
}

const initialQuestions: Question[] = [
  {
    id: 1,
    question: "What fundamental property differentiates a quantum bit (qubit) from a classical binary bit?",
    type: "MULTIPLE CHOICE",
    xp: 150,
    difficulty: "EASY",
    options: [
      { letter: "A", text: "Qubits can exist in continuous superpositions of states |0⟩ and |1⟩ simultaneously", correct: true },
      { letter: "B", text: "Qubits operate strictly at room temperature without cryostats", correct: false },
      { letter: "C", text: "Classical bits require optical lasers while qubits use copper wires", correct: false },
      { letter: "D", text: "Qubits have deterministic infinite memory registers", correct: false },
    ],
    explanation: "Unlike classical bits that are constrained to discrete 0 or 1 states, a qubit leverages superposition (|ψ⟩ = α|0⟩ + β|1⟩), allowing computational parallelism.",
  },
  {
    id: 2,
    question: "Which quantum logic gate performs a π rotation around the Z-axis of the Bloch sphere?",
    type: "MULTIPLE CHOICE",
    xp: 150,
    difficulty: "MEDIUM",
    options: [
      { letter: "A", text: "Hadamard (H) Gate", correct: false },
      { letter: "B", text: "Pauli-Z Gate", correct: true },
      { letter: "C", text: "Controlled-NOT (CNOT) Gate", correct: false },
      { letter: "D", text: "Toffoli Gate", correct: false },
    ],
    explanation: "The Pauli-Z gate maps |0⟩ to |0⟩ and |1⟩ to -|1⟩, executing a phase flip which corresponds to a 180° rotation around the Z-axis.",
  },
  {
    id: 3,
    question: "What phenomenon occurs when two qubits exhibit correlations stronger than any classical physics allows?",
    type: "MULTIPLE CHOICE",
    xp: 150,
    difficulty: "MEDIUM",
    options: [
      { letter: "A", text: "Decoherence Spillage", correct: false },
      { letter: "B", text: "Quantum Entanglement", correct: true },
      { letter: "C", text: "Thermal Dissipation", correct: false },
      { letter: "D", text: "Bose-Einstein Condensation", correct: false },
    ],
    explanation: "Quantum entanglement links composite states such that measuring one immediately determines the state of the other, violating Bell inequalities.",
  },
  {
    id: 4,
    question: "In quantum circuit design, what occurs to a qubit in an equal superposition state (|0⟩ + |1⟩)/√2 when measured along the standard computational basis?",
    type: "MULTIPLE CHOICE",
    xp: 150,
    difficulty: "HARD",
    hasVisual: true,
    options: [
      { letter: "A", text: "It collapses stochastically to state |0⟩ or |1⟩ with equal 50% probability", correct: true },
      { letter: "B", text: "It retains superposition while transmitting phase feedback to the controller", correct: false },
      { letter: "C", text: "It reflects back to ground state |0⟩ with zero energy loss", correct: false },
      { letter: "D", text: "It generates an anti-symmetric Bell state spontaneously", correct: false },
    ],
    explanation: "By Born's rule, measurement projects the superposition wave-function into an eigenstate of the measurement operator, collapsing to |0⟩ or |1⟩ with probability |1/√2|² = 0.5.",
  },
  {
    id: 5,
    question: "What is the primary role of the Hadamard gate in Shor's and Grover's search algorithms?",
    type: "MULTIPLE CHOICE",
    xp: 150,
    difficulty: "MEDIUM",
    options: [
      { letter: "A", text: "Creating an equal superposition across all computational basis states", correct: true },
      { letter: "B", text: "Correcting phase drift errors before fault-tolerant decoding", correct: false },
      { letter: "C", text: "Measuring final output register amplitudes", correct: false },
      { letter: "D", text: "Cooling ion traps during gate cycling", correct: false },
    ],
    explanation: "Applying H^⊗n transforms |00...0⟩ into a uniform superposition of all 2^n states, initializing the search space.",
  },
];

function mapBackendQuestions(backendQuestions: BackendQuizQuestion[]): Question[] {
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
  return backendQuestions.map((q, idx) => {
    const rawAnswer = String(q.answer ?? "").trim();
    const options = (q.options || []).map((optText, optIdx) => {
      const letter = letters[optIdx] || String.fromCharCode(65 + optIdx);
      const isCorrect =
        rawAnswer === String(optIdx) ||
        rawAnswer.toUpperCase() === letter ||
        rawAnswer.toLowerCase() === optText.trim().toLowerCase();
      return {
        letter,
        text: optText,
        correct: isCorrect,
      };
    });

    if (!options.some((o) => o.correct) && options.length > 0) {
      options[0].correct = true;
    }

    const rawLevel = (q.level || (idx % 3 === 0 ? "EASY" : idx % 3 === 1 ? "MEDIUM" : "HARD")).toUpperCase();
    const diff: "EASY" | "MEDIUM" | "HARD" =
      rawLevel === "EASY" ? "EASY" : rawLevel === "HARD" ? "HARD" : "MEDIUM";
    const xp = diff === "EASY" ? 100 : diff === "HARD" ? 300 : 200;

    return {
      id: idx + 1,
      questionId: q.questionId,
      question: q.question,
      type: "MULTIPLE CHOICE",
      xp,
      difficulty: diff,
      options,
      explanation: q.explanation || "No explanation provided.",
    };
  });
}

function EditorLoadingSkeleton() {
  return (
    <div className="min-h-screen relative overflow-x-hidden antialiased flex flex-col justify-between">
      <CosmicCanvas />
      <Navbar />
      <main className="relative z-10 max-w-max-width-canvas mx-auto px-4 sm:px-8 pt-32 pb-20 flex-1 flex flex-col items-center justify-center text-center">
        <div className="p-8 rounded-3xl bg-surface-container-low/70 border border-outline-variant/30 backdrop-blur-2xl shadow-2xl flex flex-col items-center gap-4 max-w-md">
          <div className="w-14 h-14 rounded-2xl bg-primary-container/20 border border-primary/40 flex items-center justify-center text-primary animate-pulse">
            <span className="material-symbols-outlined text-3xl animate-spin">
              progress_activity
            </span>
          </div>
          <div className="space-y-1">
            <h2 className="font-headline-sm text-lg font-bold text-white">
              Connecting to Neural Arena
            </h2>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Fetching quiz telemetry and synthesizing question sets from backend database...
            </p>
          </div>
          <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden mt-2">
            <div className="bg-primary h-full w-2/3 animate-pulse rounded-full" />
          </div>
        </div>
      </main>
    </div>
  );
}

function CreatorEditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizIdParam = searchParams.get("quizId");

  const [quizId, setQuizId] = useState<string | null>(quizIdParam);
  const [quizTitle, setQuizTitle] = useState<string>("Artificial Intelligence Fundamentals");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  const [activeQuestionId, setActiveQuestionId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("ALL");
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({ 1: true });

  // Runtime settings custom switch states
  const [dynamicShuffle, setDynamicShuffle] = useState(true);
  const [temporalLimit, setTemporalLimit] = useState(true);
  const [questime, setQuestime] = useState(60);
  const [immediateResult, setImmediateResult] = useState(true);

  // Telemetry stats from backend
  const [peopleAttempted, setPeopleAttempted] = useState<number>(0);
  const [averageScore, setAverageScore] = useState<number>(0);

  // Edit Question Modal state
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Auto-dismiss toasts
  useEffect(() => {
    if (apiError) {
      const t = setTimeout(() => setApiError(null), 6000);
      return () => clearTimeout(t);
    }
  }, [apiError]);

  useEffect(() => {
    if (successToast) {
      const t = setTimeout(() => setSuccessToast(null), 6000);
      return () => clearTimeout(t);
    }
  }, [successToast]);

  // Load quiz from backend or local cache
  useEffect(() => {
    async function loadQuizData() {
      setIsLoading(true);
      setApiError(null);
      setIsDemoMode(false);

      const targetQuizId = quizIdParam || quizId;

      if (targetQuizId) {
        try {
          const response = await quizService.getQuiz(targetQuizId);
          if (response?.data?.quiz) {
            const fetched = response.data.quiz;
            setQuizTitle(fetched.title || "Custom Generated Quiz");
            setQuizId(fetched.quizId);
            if (fetched.immediateResult !== undefined) {
              setImmediateResult(fetched.immediateResult);
            }
            if (fetched.questime !== undefined) {
              setQuestime(fetched.questime);
            }
            if (fetched.dynamicShuffle !== undefined) {
              setDynamicShuffle(fetched.dynamicShuffle);
            }
            if (fetched.temporalLimit !== undefined) {
              setTemporalLimit(fetched.temporalLimit);
            }
            if (response.data.stats) {
              setPeopleAttempted(response.data.stats.peopleAttempted ?? 0);
              setAverageScore(response.data.stats.averageScore ?? 0);
            }
            const mapped = mapBackendQuestions(fetched.questions || []);
            setQuestions(mapped);
            if (mapped.length > 0) {
              setActiveQuestionId(mapped[0].id);
              setShowExplanation({ [mapped[0].id]: true });
            }
            try {
              localStorage.setItem("qc_active_quiz", JSON.stringify(fetched));
            } catch (e) {}
            setIsLoading(false);
            return;
          }
        } catch (err: any) {
          console.warn("Backend quiz fetch failed:", err);
          // Check localStorage fallback
          try {
            const cachedStr = localStorage.getItem("qc_active_quiz");
            if (cachedStr) {
              const cached: Quiz = JSON.parse(cachedStr);
              if (cached.quizId === targetQuizId && cached.questions?.length > 0) {
                setQuizTitle(cached.title || "Cached Quiz");
                setQuizId(cached.quizId);
                if (cached.immediateResult !== undefined) {
                  setImmediateResult(cached.immediateResult);
                }
                if (cached.stats) {
                  setPeopleAttempted(cached.stats.peopleAttempted ?? 0);
                  setAverageScore(cached.stats.averageScore ?? 0);
                }
                const mapped = mapBackendQuestions(cached.questions);
                setQuestions(mapped);
                if (mapped.length > 0) {
                  setActiveQuestionId(mapped[0].id);
                  setShowExplanation({ [mapped[0].id]: true });
                }
                setSuccessToast("Loaded question set from local browser session.");
                setIsLoading(false);
                return;
              }
            }
          } catch (e) {}

          setApiError(formatApiError(err));
        }
      } else {
        // No quizId provided in query string: Check active quiz cache
        try {
          const cachedStr = localStorage.getItem("qc_active_quiz");
          if (cachedStr) {
            const cached: Quiz = JSON.parse(cachedStr);
            if (cached.quizId && cached.questions?.length > 0) {
              setQuizTitle(cached.title || "Review & Edit Questions");
              setQuizId(cached.quizId);
              const mapped = mapBackendQuestions(cached.questions);
              setQuestions(mapped);
              if (mapped.length > 0) {
                setActiveQuestionId(mapped[0].id);
                setShowExplanation({ [mapped[0].id]: true });
              }
              setIsLoading(false);
              return;
            }
          }
        } catch (e) {}

        // Fallback demo questions if nothing found
        setIsDemoMode(true);
        setQuizTitle("Quantum Computing Principles (Preview Mode)");
        setQuestions(initialQuestions);
        setActiveQuestionId(1);
        setShowExplanation({ 1: true });
      }

      setIsLoading(false);
    }

    loadQuizData();
  }, [quizIdParam]);

  // Dynamic Total EXP Calculation
  const totalExp = questions.reduce((sum, q) => sum + (q.xp || 150), 0);

  const activeQ = questions.find((q) => q.id === activeQuestionId) || questions[0];

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.options.some((o) => o.text.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDiff = filterDifficulty === "ALL" || q.difficulty === filterDifficulty;
    return matchesSearch && matchesDiff;
  });

  const toggleExplanation = (id: number) => {
    setShowExplanation((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Open modal for editing
  const handleOpenEditModal = (q: Question) => {
    setEditingQuestion(JSON.parse(JSON.stringify(q)));
  };

  // Save changes from modal — mapped directly to backend PUT /api/quiz/:quizId/question/:questionId
  const handleSaveEditedQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;

    const targetQ = editingQuestion;
    const correctOptIdx = targetQ.options.findIndex((o) => o.correct);

    setQuestions((prev) =>
      prev.map((q) => (q.id === targetQ.id ? targetQ : q))
    );
    setEditingQuestion(null);

    if (quizId && targetQ.questionId) {
      setIsSaving(true);
      try {
        await quizService.editQuestion(quizId, targetQ.questionId, {
          question: targetQ.question,
          options: targetQ.options.map((o) => o.text),
          answer: String(correctOptIdx >= 0 ? correctOptIdx : 0),
          explanation: targetQ.explanation,
          level: targetQ.difficulty,
        });
        setSuccessToast(`Question #${targetQ.id} updated successfully in database!`);
      } catch (err: any) {
        console.error("Backend error saving edited question:", err);
        setApiError(err?.message || "Failed to save question to database.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Add new question — mapped directly to backend POST /api/quiz/:quizId/question
  const handleAddNewQuestion = async () => {
    const newId = questions.length + 1;
    const defaultOptions = [
      { letter: "A", text: "Option statement A (Correct)", correct: true },
      { letter: "B", text: "Option statement B", correct: false },
      { letter: "C", text: "Option statement C", correct: false },
      { letter: "D", text: "Option statement D", correct: false },
    ];

    if (quizId) {
      setIsSaving(true);
      try {
        const res = await quizService.addQuestion(quizId, {
          question: "Enter new question statement...",
          options: defaultOptions.map((o) => o.text),
          answer: "0",
          explanation: "Provide clear explanation here.",
          level: "MEDIUM",
        });

        const backendQ = res.data?.question;
        const newQ: Question = {
          id: newId,
          questionId: backendQ?.questionId || `q-${Date.now()}`,
          question: backendQ?.question || "Enter new question statement...",
          type: "MULTIPLE CHOICE",
          xp: 200,
          difficulty: "MEDIUM",
          options: defaultOptions,
          explanation: "Provide clear explanation here.",
        };
        setQuestions((prev) => [...prev, newQ]);
        setActiveQuestionId(newId);
        setSuccessToast(`New Question #${newId} appended in database!`);
        return;
      } catch (err: any) {
        console.error("Backend error adding question:", err);
        setApiError(err?.message || "Failed to add question to database.");
      } finally {
        setIsSaving(false);
      }
    }

    const fallbackQ: Question = {
      id: newId,
      questionId: `q-${Date.now()}`,
      question: "Enter new question statement...",
      type: "MULTIPLE CHOICE",
      xp: 200,
      difficulty: "MEDIUM",
      options: defaultOptions,
      explanation: "Provide clear explanation here.",
    };
    setQuestions((prev) => [...prev, fallbackQ]);
    setActiveQuestionId(newId);
  };

  // Delete question — mapped directly to backend DELETE /api/quiz/:quizId/question/:questionId
  const handleDeleteQuestion = async (id: number) => {
    const targetQ = questions.find((q) => q.id === id);
    if (!targetQ) return;

    if (quizId && targetQ.questionId) {
      setIsSaving(true);
      try {
        await quizService.deleteQuestion(quizId, targetQ.questionId);
        setQuestions((prev) =>
          prev
            .filter((q) => q.id !== id)
            .map((q, idx) => ({ ...q, id: idx + 1 }))
        );
        setSuccessToast(`Question #${id} removed from database.`);
      } catch (err: any) {
        console.error("Backend error deleting question:", err);
        setApiError(err?.message || "Failed to delete question from database.");
      } finally {
        setIsSaving(false);
      }
    } else {
      setQuestions((prev) =>
        prev
          .filter((q) => q.id !== id)
          .map((q, idx) => ({ ...q, id: idx + 1 }))
      );
    }
  };

  // Toggle Immediate Result — mapped directly to backend PUT /api/quiz/:quizId
  const handleToggleImmediateResult = async () => {
    const nextVal = !immediateResult;
    setImmediateResult(nextVal);

    if (quizId) {
      try {
        await quizService.updateQuiz(quizId, { immediateResult: nextVal });
        setSuccessToast(`Immediate Result setting updated to ${nextVal ? "ON" : "OFF"} in database.`);
      } catch (err: any) {
        console.error("Backend error updating immediateResult:", err);
        setApiError(err?.message || "Failed to update Immediate Result setting in backend.");
      }
    }
  };

  // Update Question Time Limit (min 30, max 300) — mapped directly to backend PUT /api/quiz/:quizId
  const handleQuestimeChange = async (newVal: number) => {
    const clamped = Math.max(30, Math.min(300, newVal));
    setQuestime(clamped);

    if (quizId) {
      try {
        await quizService.updateQuiz(quizId, { questime: clamped });
      } catch (err: any) {
        console.error("Backend error updating questime:", err);
        setApiError(err?.message || "Failed to update question time limit in backend.");
      }
    }
  };

  // Toggle Dynamic Shuffle — mapped directly to backend PUT /api/quiz/:quizId
  const handleToggleDynamicShuffle = async () => {
    const nextVal = !dynamicShuffle;
    setDynamicShuffle(nextVal);

    if (quizId) {
      try {
        await quizService.updateQuiz(quizId, { dynamicShuffle: nextVal });
        setSuccessToast(`Dynamic Shuffle ${nextVal ? "enabled" : "disabled"} in database.`);
      } catch (err: any) {
        console.error("Backend error updating dynamicShuffle:", err);
        setApiError(err?.message || "Failed to update dynamic shuffle setting in backend.");
      }
    }
  };

  // Toggle Temporal Limit — mapped directly to backend PUT /api/quiz/:quizId
  const handleToggleTemporalLimit = async () => {
    const nextVal = !temporalLimit;
    setTemporalLimit(nextVal);

    if (quizId) {
      try {
        await quizService.updateQuiz(quizId, { temporalLimit: nextVal });
        setSuccessToast(`Temporal Limit ${nextVal ? "enabled" : "disabled"} in database.`);
      } catch (err: any) {
        console.error("Backend error updating temporalLimit:", err);
        setApiError(err?.message || "Failed to update temporal limit setting in backend.");
      }
    }
  };

  if (isLoading) {
    return <EditorLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden antialiased">
      {/* Universal Cosmic Canvas */}
      <CosmicCanvas />

      {/* Universal Top Navbar */}
      <Navbar />

      {/* Main Canvas */}
      <main className="relative z-10 max-w-max-width-canvas mx-auto px-4 sm:px-8 pt-28 pb-20 flex flex-col gap-6">
        <ParallaxReveal direction="up" distance={20} duration={650} className="flex flex-col gap-6 w-full">
          {/* Hero Header */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                {isDemoMode && (
                  <span className="font-label-code px-2.5 py-0.5 rounded-full bg-secondary-container/40 text-primary border border-primary/30 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
                    Preview Mode
                  </span>
                )}
                {quizId && (
                  <span className="font-label-code text-[11px] text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded border border-outline-variant/30">
                    ID: {quizId.slice(0, 8)}...
                  </span>
                )}
                {/* Dedicated Total EXP Tab */}
                <span className="font-label-code px-2.5 py-0.5 rounded-full bg-tertiary/10 text-tertiary border border-tertiary/30 font-bold flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-xs">electric_bolt</span>
                  Total EXP: {totalExp} XP
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-headline-xl text-on-surface tracking-tight font-extrabold">
                {quizTitle}
              </h1>
              <p className="text-xs sm:text-sm font-body-md text-on-surface-variant max-w-xl">
                Inspect AI-generated questions, tweak choices, adjust difficulty, and verify answers before publishing to your arena.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              {/* Total EXP Quick Tab Pill */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-high/80 border border-tertiary/30 font-label-code text-xs text-tertiary font-semibold shadow-sm">
                <span className="material-symbols-outlined text-sm">bolt</span>
                <span>{totalExp} TOTAL XP</span>
              </div>


              <button
                type="button"
                onClick={() => router.push(quizId ? `/quiz?quizId=${quizId}` : "/quiz")}
                className="px-3.5 py-2 rounded-xl bg-surface-container/70 border border-outline-variant/30 text-on-surface font-headline-sm text-xs flex items-center gap-1.5 hover:border-primary transition-all active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">play_circle</span>
                <span>Test Run</span>
              </button>

              <button
                type="button"
                onClick={handleAddNewQuestion}
                className="px-3.5 py-2 rounded-xl bg-primary-container hover:bg-primary-container/90 text-white font-headline-sm text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all shadow-sm border border-white/10 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">add</span>
                <span>New Question</span>
              </button>
            </div>
          </section>

          {/* Telemetry Bento Bar */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-surface-container-low/70 border border-outline-variant/30 flex items-center gap-3 backdrop-blur-md">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-xl">quiz</span>
              </div>
              <div>
                <span className="block font-label-code text-[11px] text-on-surface-variant">
                  TOTAL QUESTIONS
                </span>
                <span className="font-stat-counter text-base font-bold text-on-surface">
                  {questions.length}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low/70 border border-outline-variant/30 flex items-center gap-3 backdrop-blur-md">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined text-xl">electric_bolt</span>
              </div>
              <div>
                <span className="block font-label-code text-[11px] text-on-surface-variant">
                  AWARD CAPACITY
                </span>
                <span className="font-stat-counter text-base font-bold text-on-surface">
                  {totalExp}{" "}
                  <span className="font-body-sm text-xs text-tertiary font-normal">
                    XP
                  </span>
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low/70 border border-outline-variant/30 flex items-center gap-3 backdrop-blur-md">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-xl">group</span>
              </div>
              <div>
                <span className="block font-label-code text-[11px] text-on-surface-variant">
                  PEOPLE ATTEMPTED
                </span>
                <span className="font-stat-counter text-base font-bold text-on-surface">
                  {peopleAttempted}{" "}
                  <span className="font-body-sm text-xs text-on-surface-variant font-normal">
                    cadets
                  </span>
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low/70 border border-outline-variant/30 flex items-center gap-3 backdrop-blur-md">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-fixed">
                <span className="material-symbols-outlined text-xl">analytics</span>
              </div>
              <div>
                <span className="block font-label-code text-[11px] text-on-surface-variant">
                  AVERAGE SCORE
                </span>
                <span className="font-stat-counter text-base font-bold text-primary">
                  {averageScore}%{" "}
                  <span className="font-body-sm text-xs text-on-surface-variant font-normal">
                    accuracy
                  </span>
                </span>
              </div>
            </div>
          </section>

          {/* Filter Strip */}
          <section className="p-3 rounded-xl bg-surface-container-low/70 border border-outline-variant/20 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 backdrop-blur-md">
            <div className="flex items-center gap-2 flex-1 max-w-xl">
              <div className="relative w-full">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter questions by statement, concept, or option..."
                  className="w-full bg-surface-container-low/80 pl-9 pr-3 py-1.5 rounded-lg text-xs border border-outline-variant/30 text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container transition-all"
                />
              </div>
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-code text-xs border border-outline-variant/30"
              >
                <option value="ALL">All Levels</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            <div className="flex items-center gap-2 font-label-code text-xs">
              <button
                type="button"
                onClick={() => {
                  const json = JSON.stringify(questions, null, 2);
                  navigator.clipboard.writeText(json);
                  setSuccessToast("Quiz questions exported to clipboard as JSON!");
                }}
                className="px-3 py-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface flex items-center gap-1 border border-outline-variant/30 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">ios_share</span>
                <span>Export JSON</span>
              </button>
              <Link
                href={quizId ? `/deploy?quizId=${quizId}` : "/deploy"}
                className="px-3 py-1.5 rounded-lg bg-primary-container/20 text-primary-fixed hover:bg-primary-container/30 border border-primary-container/40 flex items-center gap-1 transition-all"
              >
                <span className="material-symbols-outlined text-sm">send</span>
                <span>Deploy Hub</span>
              </Link>
            </div>
          </section>
        </ParallaxReveal>

        {/* Workspace Grid */}
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Sidebar Question Map (4 Cols) */}
            <aside className="lg:col-span-4 flex flex-col gap-4 sticky top-24">
              <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-outline-variant/30 backdrop-blur-xl flex flex-col gap-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="font-headline-sm text-sm text-on-surface font-semibold">
                    Question Map
                  </span>
                  <span className="font-label-code text-xs px-2 py-0.5 rounded bg-surface-container text-tertiary">
                    {questions.length} NODES
                  </span>
                </div>

                {/* Node Pills Grid */}
                <div className="grid grid-cols-5 gap-1.5 font-label-code text-xs max-h-60 overflow-y-auto pr-1">
                  {questions.map((q) => {
                    const isActive = q.id === activeQuestionId;
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setActiveQuestionId(q.id)}
                        className={`py-2 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer ${
                          isActive
                            ? "bg-secondary-container text-primary-fixed border border-primary-container shadow-md shadow-primary-container/30 font-bold scale-105"
                            : "bg-surface-container text-on-surface hover:border-primary-container border border-outline-variant/20"
                        }`}
                      >
                        <span>#{q.id.toString().padStart(2, "0")}</span>
                        <span
                          className={`w-1.5 h-1.5 rounded-full mt-1 ${
                            isActive ? "bg-primary-container animate-pulse" : "bg-tertiary"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-xs font-label-code text-on-surface-variant pt-2 border-t border-outline-variant/20">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-tertiary" /> Validated ({questions.length})
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary" /> Active (#
                    {activeQuestionId.toString().padStart(2, "0")})
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleAddNewQuestion}
                  className="w-full py-2 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface font-headline-sm text-xs flex items-center justify-center gap-1.5 border border-outline-variant/30 transition-all active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">add_circle</span>
                  <span>Append New Question</span>
                </button>
              </div>

              {/* Runtime Settings Card with UI-Matching Switches & Temporal Slider */}
              <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-outline-variant/30 backdrop-blur-xl flex flex-col gap-3 shadow-lg">
                <span className="font-headline-sm text-xs font-semibold text-on-surface uppercase tracking-wider">
                  Runtime Settings
                </span>

                {/* Dynamic Shuffle Switch */}
                <div className="flex items-center justify-between py-2 border-b border-outline-variant/20 text-xs">
                  <div>
                    <span className="block text-on-surface font-medium">Dynamic Shuffle</span>
                    <span className="text-[11px] text-on-surface-variant font-label-code">
                      Randomize choices per user
                    </span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={dynamicShuffle}
                    onClick={handleToggleDynamicShuffle}
                    className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                      dynamicShuffle
                        ? "bg-primary-container"
                        : "bg-surface-container-highest border border-outline-variant/50"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${
                        dynamicShuffle ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Temporal Limit Switch */}
                <div className="flex items-center justify-between py-2 border-b border-outline-variant/20 text-xs">
                  <div>
                    <span className="block text-on-surface font-medium">Temporal Limit</span>
                    <span className="text-[11px] text-on-surface-variant font-label-code">
                      Enforce question countdown
                    </span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={temporalLimit}
                    onClick={handleToggleTemporalLimit}
                    className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                      temporalLimit
                        ? "bg-primary-container"
                        : "bg-surface-container-highest border border-outline-variant/50"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${
                        temporalLimit ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Question Duration Slider (min 30, max 300) */}
                <div className="py-2.5 border-b border-outline-variant/20 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-on-surface font-medium">Time Limit</span>
                      <span className="text-[11px] text-on-surface-variant font-label-code">
                        Seconds per question
                      </span>
                    </div>
                    <span className="font-label-code text-xs px-2.5 py-0.5 rounded-md bg-primary-container/20 text-primary-fixed border border-primary-container/40 font-bold">
                      {questime}s
                    </span>
                  </div>
                  <div className="space-y-1">
                    <input
                      type="range"
                      min={30}
                      max={300}
                      step={5}
                      value={questime}
                      disabled={!temporalLimit}
                      onChange={(e) => handleQuestimeChange(Number(e.target.value))}
                      className={`w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary ${
                        !temporalLimit ? "opacity-30 cursor-not-allowed" : ""
                      }`}
                    />
                    <div className="flex justify-between text-[10px] font-label-code text-on-surface-variant">
                      <span>30s</span>
                      <span className="text-primary font-semibold">{questime}s</span>
                      <span>300s</span>
                    </div>
                  </div>
                </div>

                {/* Immediate Result Switch */}
                <div className="flex items-center justify-between py-2 text-xs">
                  <div>
                    <span className="block text-on-surface font-medium">Immediate Result</span>
                    <span className="text-[11px] text-on-surface-variant font-label-code">
                      Show answer after submission
                    </span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={immediateResult}
                    onClick={handleToggleImmediateResult}
                    className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                      immediateResult
                        ? "bg-primary-container"
                        : "bg-surface-container-highest border border-outline-variant/50"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${
                        immediateResult ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </aside>

            {/* Question Editor Stream (8 Cols) */}
            <section className="lg:col-span-8 flex flex-col gap-4">
              {questions.length === 0 ? (
                <div className="p-8 rounded-2xl bg-surface-container-low/70 border border-outline-variant/30 text-center space-y-3">
                  <span className="material-symbols-outlined text-4xl text-outline">
                    quiz
                  </span>
                  <p className="font-headline-sm text-sm text-on-surface-variant">
                    No questions available in this set. Click &apos;New Question&apos; to create one.
                  </p>
                </div>
              ) : (
                filteredQuestions.map((q) => {
                  return (
                    <article
                      key={q.id}
                      onClick={() => setActiveQuestionId(q.id)}
                      className={`rounded-2xl p-5 border transition-all space-y-4 cursor-pointer relative overflow-hidden backdrop-blur-xl ${
                        activeQuestionId === q.id
                          ? "bg-surface-container-low/90 border-primary-container shadow-xl ring-1 ring-primary-container/30"
                          : "bg-surface-container-low/60 border-outline-variant/30 hover:border-outline-variant/60"
                      }`}
                    >
                      {/* Card Header & Controls */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-outline-variant/20">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-surface-container-highest font-label-code text-xs font-bold flex items-center justify-center text-primary">
                            #{q.id.toString().padStart(2, "0")}
                          </span>

                          <span className="font-label-code text-[11px] px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">
                            {q.type}
                          </span>

                          <span className="font-label-code text-[11px] px-2 py-0.5 rounded bg-tertiary/15 text-tertiary font-bold">
                            +{q.xp} XP
                          </span>

                          {/* Read-Only Difficulty Level Badge */}
                          <span
                            className={`text-[10px] font-label-code px-2 py-0.5 rounded font-bold uppercase border ${
                              q.difficulty === "EASY"
                                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                : q.difficulty === "HARD"
                                ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                                : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                            }`}
                          >
                            {q.difficulty}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Edit Question in Modal */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditModal(q);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-bright text-on-surface hover:text-white text-xs flex items-center gap-1 font-label-code border border-outline-variant/30 transition-colors cursor-pointer"
                            title="Edit question statement, choices & explanation"
                          >
                            <span className="material-symbols-outlined text-sm text-primary">
                              edit
                            </span>
                            <span>Edit Question</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExplanation(q.id);
                            }}
                            className="p-1 px-2 rounded-lg hover:bg-surface-bright text-on-surface-variant hover:text-primary text-xs flex items-center gap-1 font-label-code cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-sm">
                              psychology
                            </span>
                            <span>Explanation</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteQuestion(q.id);
                            }}
                            className="p-1 rounded-lg hover:bg-error-container/20 text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                            title="Delete Question"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>
                      </div>

                      {/* Question Statement */}
                      <div>
                        <h2 className="font-headline-sm text-base text-on-surface font-medium leading-relaxed">
                          {q.question}
                        </h2>
                      </div>

                      {/* Options List (Read-only in main stream, editable via Edit Question modal) */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-label-code text-on-surface-variant px-1">
                          <span>Choices</span>
                          <span className="text-[10px] opacity-70">Edit via &apos;Edit Question&apos;</span>
                        </div>

                        {q.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`p-3 rounded-xl flex items-center justify-between gap-3 text-xs border transition-all ${
                              opt.correct
                                ? "bg-emerald-950/30 border-emerald-500/50 text-emerald-200 shadow-sm"
                                : "bg-surface-container/60 border-outline-variant/30 text-on-surface-variant"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 flex-1">
                              <span
                                className={`w-6 h-6 rounded-lg flex items-center justify-center font-label-code font-bold text-xs shrink-0 ${
                                  opt.correct
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                    : "bg-surface-container-highest text-outline"
                                }`}
                              >
                                {opt.letter}
                              </span>
                              <span className="font-body-md text-xs">{opt.text}</span>
                            </div>

                            {opt.correct && (
                              <span className="inline-flex items-center gap-1 font-label-code text-[11px] text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30 shrink-0">
                                <span className="material-symbols-outlined text-xs">
                                  check_circle
                                </span>
                                <span>Correct Answer</span>
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Explanation Drawer */}
                      {showExplanation[q.id] && (
                        <div className="p-3.5 rounded-xl bg-primary-container/10 border border-primary-container/30 text-xs font-body-sm space-y-1">
                          <div className="flex items-center gap-1 font-label-code text-primary text-[11px] font-bold">
                            <span className="material-symbols-outlined text-sm">
                              menu_book
                            </span>
                            <span>EXPLANATION</span>
                          </div>
                          <p className="text-on-surface-variant leading-relaxed">
                            {q.explanation}
                          </p>
                        </div>
                      )}
                    </article>
                  );
                })
              )}
            </section>
          </div>
        </div>

        {/* Question Edit Modal */}
        {editingQuestion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-surface-container-lowest/80 backdrop-blur-xl animate-fadeIn">
            <div className="w-full max-w-2xl rounded-3xl glass-kage border border-white/15 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary-container/20 border border-primary/40 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-base">edit</span>
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-base font-bold text-white">
                      Edit Question #{editingQuestion.id.toString().padStart(2, "0")}
                    </h3>
                    <span className="text-[11px] font-label-code text-on-surface-variant">
                      Modify statement, options, difficulty, and explanation
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingQuestion(null)}
                  className="p-1 rounded-lg hover:bg-white/10 text-outline hover:text-white transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>

              <form onSubmit={handleSaveEditedQuestion} className="space-y-4">
                {/* Question Statement */}
                <div>
                  <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5 font-headline-sm">
                    Question Statement
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={editingQuestion.question}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        question: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-xl bg-surface-container/60 border border-outline-variant/40 text-on-surface text-xs focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>

                {/* Difficulty and XP */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5 font-headline-sm">
                      Difficulty Level
                    </label>
                    <select
                      value={editingQuestion.difficulty}
                      onChange={(e) => {
                        const newDiff = e.target.value as "EASY" | "MEDIUM" | "HARD";
                        const newXp = newDiff === "EASY" ? 100 : newDiff === "HARD" ? 300 : 200;
                        setEditingQuestion({
                          ...editingQuestion,
                          difficulty: newDiff,
                          xp: newXp,
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container/60 border border-outline-variant/40 text-on-surface text-xs focus:outline-none focus:border-primary font-label-code cursor-pointer"
                    >
                      <option value="EASY" className="bg-surface-container-high text-emerald-400">
                        EASY
                      </option>
                      <option value="MEDIUM" className="bg-surface-container-high text-amber-300">
                        MEDIUM
                      </option>
                      <option value="HARD" className="bg-surface-container-high text-rose-400">
                        HARD
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5 font-headline-sm">
                      XP Award (Auto-Set)
                    </label>
                    <div className="w-full px-3 py-2 rounded-xl bg-surface-container/60 border border-outline-variant/40 text-tertiary text-xs font-label-code font-bold flex items-center justify-between">
                      <span>+{editingQuestion.xp} XP</span>
                      <span className="text-[10px] text-on-surface-variant font-normal">
                        Fixed for {editingQuestion.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Options List */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-semibold text-white uppercase tracking-wider font-headline-sm">
                    Answer Options (Select the radio to mark the correct choice)
                  </label>

                  {editingQuestion.options.map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${
                        opt.correct
                          ? "bg-emerald-950/20 border-emerald-500/40"
                          : "bg-surface-container/40 border-outline-variant/30"
                      }`}
                    >
                      <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
                        <input
                          type="radio"
                          name="correctOptionRadio"
                          checked={opt.correct}
                          onChange={() => {
                            setEditingQuestion({
                              ...editingQuestion,
                              options: editingQuestion.options.map((o, idx) => ({
                                ...o,
                                correct: idx === oIdx,
                              })),
                            });
                          }}
                          className="text-emerald-500 focus:ring-0"
                        />
                        <span className="font-label-code font-bold text-xs px-2 py-0.5 rounded bg-surface-container-highest text-white">
                          {opt.letter}
                        </span>
                      </label>

                      <input
                        type="text"
                        required
                        value={opt.text}
                        onChange={(e) => {
                          const newText = e.target.value;
                          setEditingQuestion({
                            ...editingQuestion,
                            options: editingQuestion.options.map((o, idx) =>
                              idx === oIdx ? { ...o, text: newText } : o
                            ),
                          });
                        }}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-surface-container-lowest/80 border border-outline-variant/40 text-on-surface text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                  ))}
                </div>

                {/* Explanation */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5 font-headline-sm">
                    Explanation
                  </label>
                  <textarea
                    rows={2}
                    value={editingQuestion.explanation}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        explanation: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-xl bg-surface-container/60 border border-outline-variant/40 text-on-surface text-xs focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setEditingQuestion(null)}
                    className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-headline-sm transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-primary-container hover:bg-primary-container/90 text-white font-headline-sm text-xs font-semibold shadow-sm border border-white/10 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">save</span>
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-lowest/80 backdrop-blur-md border-t border-outline-variant/20 py-4 px-6 relative z-10 text-xs font-label-code text-on-surface-variant">
        <div className="max-w-max-width-canvas mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <span>QuizzCraft Review Studio</span>
        </div>
      </footer>

      {/* Floating Error Toast Notification */}
      {apiError && (
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
                  Backend Notice
                </p>
                <button
                  type="button"
                  onClick={() => setApiError(null)}
                  className="text-on-surface-variant hover:text-white transition-colors p-0.5 rounded-lg cursor-pointer"
                  aria-label="Dismiss error toast"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>
              <p className="mt-1 text-xs text-red-200/90 leading-relaxed break-words font-body-sm">
                {apiError}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Success Toast Notification */}
      {successToast && (
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
                  onClick={() => setSuccessToast(null)}
                  className="text-on-surface-variant hover:text-white transition-colors p-0.5 rounded-lg cursor-pointer"
                  aria-label="Dismiss success toast"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>
              <p className="mt-1 text-xs text-emerald-200/90 leading-relaxed break-words font-body-sm">
                {successToast}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CreatorEditorPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<EditorLoadingSkeleton />}>
        <CreatorEditorContent />
      </Suspense>
    </ProtectedRoute>
  );
}
