export interface IQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  _id?: string; // Mongoose automatically adds _id for subdocuments
}

export interface IQuiz {
  quizId: string;
  title: string;
  questions: IQuestion[];
}
