import { generateQuizDto } from '../../quiz/dto/quiz.request.dto';
import { IAiGeneratedQuizResponse } from '../../common/interfaces/quiz.interface';

export interface AiProvider {
  generateQuiz(dto: generateQuizDto): Promise<IAiGeneratedQuizResponse>;
}
