"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

interface Option {
  id: string;
  letter: string;
  text: string;
  isCorrect: boolean;
}

interface HeroQuestion {
  id: string;
  topic: string;
  rigor: string;
  timer: string;
  statement: string;
  options: Option[];
  rewardXp: number;
  multiplier: string;
}

const FALLBACK_QUESTIONS: HeroQuestion[] = [
  {
    id: "q-1",
    topic: "QUANTUM MECHANICS",
    rigor: "High",
    timer: "15s Blitz",
    statement: "What phenomenon allows qubits to exist in multiple simultaneous probability states?",
    options: [
      { id: "opt-1a", letter: "A", text: "Quantum Tunneling", isCorrect: false },
      { id: "opt-1b", letter: "B", text: "Quantum Superposition", isCorrect: true },
      { id: "opt-1c", letter: "C", text: "Thermal Dissipation", isCorrect: false },
    ],
    rewardXp: 450,
    multiplier: "Streak: 4x Multiplier",
  },
  {
    id: "q-2",
    topic: "COGNITIVE NEUROSCIENCE",
    rigor: "Elite",
    timer: "20s Blitz",
    statement: "Which biological mechanism governs synaptic strengthening during repeated active recall?",
    options: [
      { id: "opt-2a", letter: "A", text: "Long-Term Potentiation (LTP)", isCorrect: true },
      { id: "opt-2b", letter: "B", text: "Retrograde Axonal Pruning", isCorrect: false },
      { id: "opt-2c", letter: "C", text: "Dendritic Myelination Lag", isCorrect: false },
    ],
    rewardXp: 600,
    multiplier: "Streak: 5x Multiplier",
  },
  {
    id: "q-3",
    topic: "GENERAL RELATIVITY",
    rigor: "Advanced",
    timer: "15s Blitz",
    statement: "At what boundary does the escape velocity of a black hole precisely equal the speed of light?",
    options: [
      { id: "opt-3a", letter: "A", text: "Ergosphere Boundary", isCorrect: false },
      { id: "opt-3b", letter: "B", text: "Event Horizon (Schwarzschild)", isCorrect: true },
      { id: "opt-3c", letter: "C", text: "Photon Sphere Orbit", isCorrect: false },
    ],
    rewardXp: 500,
    multiplier: "Streak: 4x Multiplier",
  },
  {
    id: "q-4",
    topic: "INFORMATION THEORY",
    rigor: "High",
    timer: "15s Blitz",
    statement: "What metric quantifies the average amount of surprise or uncertainty produced by an information source?",
    options: [
      { id: "opt-4a", letter: "A", text: "Shannon Entropy", isCorrect: true },
      { id: "opt-4b", letter: "B", text: "Hamming Distance", isCorrect: false },
      { id: "opt-4c", letter: "C", text: "Markov Transition Rate", isCorrect: false },
    ],
    rewardXp: 450,
    multiplier: "Streak: 3x Multiplier",
  },
  {
    id: "q-5",
    topic: "MOLECULAR BIOLOGY",
    rigor: "Advanced",
    timer: "18s Blitz",
    statement: "Which enzyme complex synthesizes messenger RNA from a template DNA strand during transcription?",
    options: [
      { id: "opt-5a", letter: "A", text: "DNA Ligase III", isCorrect: false },
      { id: "opt-5b", letter: "B", text: "RNA Polymerase II", isCorrect: true },
      { id: "opt-5c", letter: "C", text: "Topoisomerase", isCorrect: false },
    ],
    rewardXp: 550,
    multiplier: "Streak: 4x Multiplier",
  },
];

interface AshParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  aspect: number;
  rotation: number;
  vRot: number;
  alpha: number;
  decay: number;
  colorPrefix: string;
}

export default function HeroQuizCard3D() {
  const [questions, setQuestions] = useState<HeroQuestion[]>(FALLBACK_QUESTIONS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showXpToast, setShowXpToast] = useState(false);
  const [xpCounterText, setXpCounterText] = useState("+450 XP");
  const [isCorrectState, setIsCorrectState] = useState<boolean | null>(null);
  const [isDisintegrating, setIsDisintegrating] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardContainerRef = useRef<HTMLDivElement | null>(null);

  // Dynamic backend fetch
  useEffect(() => {
    let isMounted = true;
    fetch("/api/hero-quiz")
      .then((res) => res.json())
      .then((json) => {
        if (isMounted && json?.data && Array.isArray(json.data) && json.data.length > 0) {
          setQuestions(json.data);
        }
      })
      .catch(() => {
        // Fallback already in place
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const currentQ = questions[currentIdx] || FALLBACK_QUESTIONS[0];
  const nextQ = questions[(currentIdx + 1) % questions.length] || FALLBACK_QUESTIONS[0];

  // Ash Blow Disintegration Physics Animation
  const triggerAshBlow = useCallback(() => {
    const canvas = canvasRef.current;
    const card = cardContainerRef.current;
    if (!canvas || !card) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = card.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const w = rect.width + 120;
    const h = rect.height + 120;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const particles: AshParticle[] = [];
    const colors = [
      "rgba(220, 226, 245, ", // pale ash
      "rgba(165, 175, 200, ", // charcoal ash
      "rgba(255, 180, 70, ",  // ember gold
      "rgba(180, 140, 255, ", // cosmic violet spark
    ];

    // Spawn 150 drifting ash and ember particles
    const particleCount = 150;
    for (let i = 0; i < particleCount; i++) {
      const px = 40 + Math.random() * rect.width;
      const py = 40 + Math.random() * rect.height;
      const vx = 3.0 + Math.random() * 5.0; // blowing rightwards
      const vy = -1.5 - Math.random() * 4.0; // lifting upwards in the wind
      const color = colors[Math.floor(Math.random() * colors.length)];

      particles.push({
        x: px,
        y: py,
        vx,
        vy,
        size: 1.5 + Math.random() * 4.0,
        aspect: 0.4 + Math.random() * 0.6,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.15,
        alpha: 0.85 + Math.random() * 0.15,
        decay: 0.02 + Math.random() * 0.025,
        colorPrefix: color,
      });
    }

    let animId: number;
    let startTime = performance.now();

    const renderAsh = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      let aliveCount = 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.alpha <= 0) continue;

        aliveCount++;
        p.x += p.vx + Math.sin(p.y * 0.04 + now * 0.005) * 0.8;
        p.y += p.vy;
        p.vy -= 0.04; // buoyant updraft
        p.vx *= 0.985;
        p.rotation += p.vRot;
        p.alpha -= p.decay;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.colorPrefix + Math.max(0, p.alpha) + ")";

        // Draw shred/flake particle
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * p.aspect, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (aliveCount > 0 && now - startTime < 800) {
        animId = requestAnimationFrame(renderAsh);
      } else {
        ctx.clearRect(0, 0, w, h);
      }
    };

    animId = requestAnimationFrame(renderAsh);
  }, []);

  const handleSelectOption = useCallback(
    (opt: Option) => {
      if (isLocked) return;
      setIsLocked(true);
      setSelectedOptionId(opt.id);
      setIsCorrectState(opt.isCorrect);

      if (opt.isCorrect) {
        setXpCounterText(`+${currentQ.rewardXp * 2} XP 🔥`);
        setShowXpToast(true);
      } else {
        setXpCounterText("+0 XP");
        setShowXpToast(false);
      }

      // 1. Brief pause to register user's answer (550ms)
      setTimeout(() => {
        // 2. Start Ash Blow Disintegration
        setIsDisintegrating(true);
        triggerAshBlow();

        // 3. Complete transition, switch to next question, and reconstitute card (650ms)
        setTimeout(() => {
          setCurrentIdx((prev) => (prev + 1) % questions.length);
          setSelectedOptionId(null);
          setIsCorrectState(null);
          setShowXpToast(false);
          setIsDisintegrating(false);
          setIsLocked(false);
        }, 650);
      }, 550);
    },
    [isLocked, currentQ, questions.length, triggerAshBlow]
  );

  return (
    <div className="w-full lg:col-span-5 flex justify-center items-center py-2 sm:py-4 relative">
      {/* Responsive Card Deck - Dynamic Backend Questions with Ash Blow Transition */}
      <div
        ref={cardContainerRef}
        className="w-full max-w-[360px] sm:max-w-md relative select-none"
      >
        {/* Ash Particles Canvas Overlay */}
        <canvas
          ref={canvasRef}
          className="absolute -inset-14 w-[calc(100%+112px)] h-[calc(100%+112px)] pointer-events-none z-40"
        />

        {/* Back Depth Card 2 */}
        <div className="absolute inset-0 glass-kage rounded-2xl p-5 border border-primary/20 pointer-events-none transform -rotate-3 -translate-x-2.5 -translate-y-3 scale-95 opacity-30" />

        {/* Back Depth Card 1 (Upcoming Next Question Silhouette) */}
        <div
          className={`absolute inset-0 glass-kage rounded-2xl p-5 border border-tertiary/30 pointer-events-none transform transition-all duration-700 ease-out ${
            isDisintegrating
              ? "rotate-0 translate-x-0 translate-y-0 scale-100 opacity-90 border-primary/40 shadow-2xl"
              : "rotate-2 translate-x-2 -translate-y-1.5 scale-[0.98] opacity-50"
          }`}
        >
          <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3 mb-4 opacity-70">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
              <span className="text-label-code text-xs text-tertiary font-semibold tracking-wider">
                LIVE 3D CARD
              </span>
            </div>
            <div className="text-label-code text-xs text-primary">{nextQ.timer}</div>
          </div>
          <p className="text-xs text-on-surface-variant font-label-code uppercase tracking-wider mb-2">
            {nextQ.topic}
          </p>
          <h4 className="text-white text-base font-bold line-clamp-2 opacity-80">
            {nextQ.statement}
          </h4>
        </div>

        {/* Front Active Interactive Quiz Card (Transitions with Ash Blow) */}
        <div
          className={`relative glass-kage rounded-2xl p-5 sm:p-6 border border-primary/40 shadow-2xl shadow-primary-container/20 transform transition-all duration-700 ease-out ${
            isDisintegrating
              ? "opacity-0 translate-x-12 -translate-y-8 rotate-3 scale-95 blur-[4px] brightness-125 pointer-events-none"
              : "opacity-100 translate-x-0 translate-y-0 rotate-0 scale-100 blur-0 brightness-100"
          }`}
        >
          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse" />
              <span className="text-label-code text-xs text-tertiary font-semibold tracking-wider">
                LIVE 3D CARD
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-surface-container px-2.5 py-1 rounded-md text-label-code text-xs text-primary border border-primary/20">
              <span className="material-symbols-outlined text-sm">timer</span>
              <span>{currentQ.timer}</span>
            </div>
          </div>

          {/* Question Area */}
          <div className="space-y-1.5 mb-5 select-none">
            <div className="flex items-center justify-between">
              <span className="text-xs font-label-code text-amber-accent uppercase tracking-wider">
                {currentQ.topic}
              </span>
              <span className="text-xs font-label-code text-outline">
                Rigor: {currentQ.rigor}
              </span>
            </div>
            <h3 className="text-headline-sm text-white text-lg font-bold leading-snug min-h-[54px]">
              {currentQ.statement}
            </h3>
          </div>

          {/* Interactive Choices Container */}
          <div className="space-y-2.5 mb-5 relative">
            {currentQ.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              let btnStyle =
                "bg-surface-container/80 border-outline-variant/40 hover:border-primary/70 hover:bg-surface-container text-on-surface";
              let iconText = "radio_button_unchecked";
              let iconColor = "text-outline";

              if (isSelected) {
                if (opt.isCorrect) {
                  btnStyle =
                    "border-tertiary bg-tertiary/20 text-tertiary shadow-lg shadow-tertiary/20 font-semibold";
                  iconText = "check_circle";
                  iconColor = "text-tertiary";
                } else {
                  btnStyle =
                    "border-error bg-error/20 text-error shadow-lg shadow-error/20 font-semibold";
                  iconText = "cancel";
                  iconColor = "text-error";
                }
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={isLocked}
                  onClick={() => handleSelectOption(opt)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-colors duration-150 flex items-center justify-between text-sm cursor-pointer select-none touch-manipulation active:scale-[0.99] disabled:cursor-default ${btnStyle}`}
                >
                  <span className="font-medium pr-2">
                    <strong className="text-tertiary mr-1.5">{opt.letter}.</strong> {opt.text}
                  </span>
                  <span
                    className={`material-symbols-outlined text-lg transition-colors shrink-0 ${iconColor}`}
                  >
                    {iconText}
                  </span>
                </button>
              );
            })}

            {/* Floating XP Feedback Notification */}
            {showXpToast && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-black/90 border border-amber-accent text-amber-accent font-stat-counter font-bold text-sm shadow-2xl backdrop-blur-md pointer-events-none z-50 animate-bounce">
                +{currentQ.rewardXp * 2} XP // STREAK COMBO!
              </div>
            )}
          </div>

          {/* Footer Telemetry */}
          <div className="flex items-center justify-between pt-3 border-t border-outline-variant/30 text-label-code text-xs select-none">
            <div className="flex items-center gap-1.5 text-amber-accent font-semibold">
              <span className="material-symbols-outlined text-base">local_fire_department</span>
              <span>{currentQ.multiplier}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-on-surface-variant">Reward:</span>
              <span
                className={`font-bold tracking-wider ${
                  isCorrectState === true
                    ? "text-amber-accent"
                    : isCorrectState === false
                    ? "text-outline"
                    : "text-tertiary"
                }`}
              >
                {xpCounterText}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
