import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Quiz } from '../schemas/quiz.schema';
import { User } from '../schemas/user.schema';
import { generateQuizDto } from './dto/quiz.request.dto';
import { ServiceResponse } from '../common/interfaces/service-response.interface';
import { generateQuizResponseData } from './dto/quiz.response.dto';
import { AI_PROVIDER } from '../ai/ai.constants';
import type { AiProvider } from '../ai/interfaces/ai-provider.interface';
import { IAiGeneratedQuizResponse } from '../common/interfaces/quiz.interface'; // Renamed interface
import { IQuiz } from '../common/interfaces/quiz-types.interface'; // New core interface

@Injectable()
export class QuizService {
  constructor(
    @Inject('USER_MODEL') private UserModel: Model<User>,
    @Inject('QUIZ_MODEL') private QuizModel: Model<Quiz>,
    @Inject(AI_PROVIDER) private ai: AiProvider,
  ) {}

  async generateQuiz(
    dto: generateQuizDto,
  ): Promise<ServiceResponse<generateQuizResponseData>> { // Return type remains the same
    try {
      // console.log(dto)
      const generatedQuiz: IAiGeneratedQuizResponse = await this.ai.generateQuiz(dto); // Use new AI response interface
      try {
        const newQuiz: IQuiz = { // Explicitly type newQuiz as IQuiz
          quizId: crypto.randomUUID(),
          title: generatedQuiz?.quiz.title,
          questions: generatedQuiz?.quiz.questions,
        };
        console.log('Generated Quiz:', generatedQuiz.quiz.questions[0]);
        const createdQuiz = await this.QuizModel.create(newQuiz);
        return {
          message: 'Quiz generated successfully',
          data: {
            quiz:  createdQuiz as  Quiz & IQuiz,
          },
        };
      } catch (error) {
        console.error('Error while creating new quiz object:', error);
        throw new Error('Failed to create new quiz object');
      }
      
    } catch (error: any) {
      throw new Error(`Failed to generate quiz: ${error}`);
    }
  }
}
