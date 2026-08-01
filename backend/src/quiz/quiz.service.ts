import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Quiz } from '../schemas/quiz.schema';
import { User } from '../schemas/user.schema';
import { generateQuizDto } from './dto/quiz.request.dto';
import { ServiceResponse } from '../common/interfaces/service-response.interface';
import { generateQuizResponseData } from './dto/quiz.response.dto';
import { AI_PROVIDER } from '../ai/ai.constants';
import type { AiProvider } from '../ai/interfaces/ai-provider.interface';

@Injectable()
export class QuizService {
  constructor(
    @Inject('USER_MODEL') private UserModel: Model<User>,
    @Inject('QUIZ_MODEL') private QuizModel: Model<Quiz>,
    @Inject(AI_PROVIDER) private ai: AiProvider,
  ) {}
  async generateQuiz(
    dto: generateQuizDto,
  ): Promise<ServiceResponse<generateQuizResponseData>> {
    try {
      const generatedQuiz = await this.ai.generateQuiz(dto);
    } catch (error: any) {
      throw new Error(`Failed to generate quiz: ${error}`);
    }
    return {
      message: 'Quiz generated successfully',
      data: {
        status: true,
      },
    };
  }
}
