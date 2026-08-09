import { Quiz } from '../../schemas/quiz.schema';
import { IQuiz } from '../../common/interfaces/quiz-types.interface';

export interface generateQuizResponseData {
  // The 'quiz' property will be the Mongoose document itself, which implements IQuiz
  quiz: Quiz & IQuiz;
}
