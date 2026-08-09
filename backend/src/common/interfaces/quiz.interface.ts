import { IQuestion } from './quiz-types.interface';

// This interface represents the structure of the response from the AI provider
export interface IAiGeneratedQuizResponse {
  quiz: {
    title: string;
    questions: [
      {
        question: string;
        options: string[];
        answer: string;
        explanation: string;
      },
    ];
  };
}
