import { NextResponse } from "next/server";

export interface HeroQuestion {
  id: string;
  topic: string;
  rigor: string;
  timer: string;
  statement: string;
  options: {
    id: string;
    letter: string;
    text: string;
    isCorrect: boolean;
  }[];
  rewardXp: number;
  multiplier: string;
}

const QUESTION_POOL: HeroQuestion[] = [
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

export async function GET() {
  return NextResponse.json({
    success: true,
    data: QUESTION_POOL,
    count: QUESTION_POOL.length,
    timestamp: new Date().toISOString(),
  });
}
