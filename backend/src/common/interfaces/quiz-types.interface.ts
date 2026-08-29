export interface IQuestion {
  questionId: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface IQuiz {
  quizId: string;
  title: string;
  questions: IQuestion[];
}
