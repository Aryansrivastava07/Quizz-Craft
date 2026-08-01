import { generateQuizDto } from '../../quiz/dto/quiz.request.dto';

export interface AiProvider {
  generateQuiz(dto: generateQuizDto): Promise<string>;
}
