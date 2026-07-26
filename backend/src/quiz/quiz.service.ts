import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Quiz } from '../schemas/quiz.schema';
import { User } from '../schemas/user.schema';
import { generateQuizDto } from './dto/quiz.request.dto';
import { ServiceResponse } from '../common/interfaces/service-response.interface';
import { generateQuizResponseData } from './dto/quiz.response.dto';

@Injectable()
export class QuizService {
  constructor(
    @Inject('USER_MODEL') private UserModel: Model<User>,
    @Inject('QUIZ_MODEL') private QuizModel: Model<Quiz>,
  ) {}
  async generateQuiz(
    dto: generateQuizDto,
  ): Promise<ServiceResponse<generateQuizResponseData>> {
    return {
      message: 'Quiz generated successfully',
      data: {},
    };
  }
}
