export interface IQuestion {
  questionId: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  level?: string;
  xp?: number;
}

export interface IQuiz {
  quizId: string;
  title: string;
  immediateResult?: boolean;
  questime?: number;
  dynamicShuffle?: boolean;
  temporalLimit?: boolean;
  questions: IQuestion[];
}
