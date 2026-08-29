import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Model } from 'mongoose';
import { Quiz } from '../schemas/quiz.schema';
import { User } from '../schemas/user.schema';
import {
  answerQuizDto,
  attemptQuizDto,
  generateQuizDto,
} from './dto/quiz.request.dto';
import { ServiceResponse } from '../common/interfaces/service-response.interface';
import { generateQuizResponseData } from './dto/quiz.response.dto';
import { AI_PROVIDER } from '../ai/ai.constants';
import type { AiProvider } from '../ai/interfaces/ai-provider.interface';
import { IAiGeneratedQuizResponse } from '../common/interfaces/quiz.interface'; // Renamed interface
import { IQuiz } from '../common/interfaces/quiz-types.interface'; // New core interface
import { Attempts } from '../schemas/attempts.schema';

@Injectable()
export class QuizService {
  constructor(
    @Inject('USER_MODEL') private UserModel: Model<User>,
    @Inject('QUIZ_MODEL') private QuizModel: Model<Quiz>,
    @Inject('ATTEMPTS_MODEL') private AttemptsModel: Model<Attempts>,
    @Inject(AI_PROVIDER) private ai: AiProvider,
  ) {}

  async generateQuiz(
    dto: generateQuizDto,
  ): Promise<ServiceResponse<generateQuizResponseData>> {
    // Return type remains the same
    try {
      const generatedQuiz: IAiGeneratedQuizResponse =
        await this.ai.generateQuiz(dto); // Use new AI response interface
      try {
        const questions = generatedQuiz.quiz.questions.map((question) => ({
          ...question,
          questionId: randomUUID(),
        }));

        const newQuiz: IQuiz = {
          quizId: randomUUID(),
          title: generatedQuiz.quiz.title,
          questions,
        };
        const createdQuiz = await this.QuizModel.create(newQuiz);
        return {
          message: 'Quiz generated successfully',
          data: {
            quiz: createdQuiz.toObject() as Quiz & IQuiz,
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

  async createAttempt(dto: attemptQuizDto, userId: string) {
    const quiz = this.QuizModel.findOne({ quizId: dto.quizId });
    if (!quiz) throw new NotFoundException('No Quiz found for this Id');
    const lastSession = await this.AttemptsModel.findOne({
      userId,
      isActive: true,
    });

    const timeBufferAllowed = 5 * 60 * 1000;

    if (lastSession) {
      const lastUpdatedAt = new Date(lastSession.lastUpdateAt).getTime();
      const now = Date.now();
      const isExpired = now - lastUpdatedAt >= timeBufferAllowed;

      if (!isExpired) {
        return {
          message: 'An active session already exists',
          data: { session: lastSession },
        };
      }

      await this.AttemptsModel.updateOne(
        { sessionId: lastSession.sessionId },
        { isActive: false },
      );
    }

    const sessionId = randomUUID();
    const createSession = await this.AttemptsModel.create({
      sessionId,
      quizId: dto.quizId,
      userId,
      isActive: true,
      lastUpdateAt: new Date().toISOString(),
      Responses: [],
    });

    return {
      message: 'dwdw',
      data: {
        createSession,
      },
    };
  }

  async updateResponse(sessionId: string, dto: answerQuizDto, userId: string) {
    const session = await this.AttemptsModel.findOne({ sessionId });

    if (!session || !session.isActive) {
      throw new NotFoundException('Session not found');
    }

    if (session.userId !== userId) {
      throw new UnauthorizedException('User not Authorized');
    }

    const existingIndex = session.Responses.findIndex(
      (response) => response.questionId === dto.questionId,
    );

    const updatedResponses = [...session.Responses];
    const newResponse = {
      questionId: dto.questionId,
      chosenOption: [dto.option],
    };

    if (existingIndex >= 0) {
      updatedResponses[existingIndex] = newResponse;
    } else {
      updatedResponses.push(newResponse);
    }

    const result = await this.AttemptsModel.updateOne(
      { sessionId },
      {
        Responses: updatedResponses,
        lastUpdateAt: new Date().toISOString(),
      },
    );

    return {
      message: 'Answer Saved',
      data: true,
    };
  }

  async submitResponse(sessionId: string, dto: answerQuizDto, userId: string) {
    const session = await this.AttemptsModel.findOne({ sessionId });
    const user = await this.UserModel.findById(userId);
    if (!user) throw new UnauthorizedException();
    if (!session || !session.isActive) {
      throw new NotFoundException('Session not found');
    }

    if (session.userId !== userId) {
      throw new UnauthorizedException('User not Authorized');
    }

    const existingIndex = session.Responses.findIndex(
      (response) => response.questionId === dto.questionId,
    );

    const updatedResponses = [...session.Responses];
    const newResponse = {
      questionId: dto.questionId,
      chosenOption: [dto.option],
    };

    if (existingIndex >= 0) {
      updatedResponses[existingIndex] = newResponse;
    } else {
      updatedResponses.push(newResponse);
    }

    await this.AttemptsModel.updateOne(
      { sessionId },
      {
        Responses: updatedResponses,
        lastUpdateAt: new Date().toISOString(),
        isActive: false,
      },
    );

    const userAttempt = await this.AttemptsModel.find({
      userId,
    });
    if (userAttempt.length === 1 && userAttempt[0].sessionId === sessionId) {
      const quizAttempted = user.quizAttempted + 1;
      await this.UserModel.updateOne({ userId }, { quizAttempted });
    }

    return {
      message: 'Quiz Submitted',
      data: true,
    };
  }

  async getScore(sessionId: string, userId: string) {
    const user = await this.UserModel.findById(userId);
    const session = await this.AttemptsModel.findOne({ sessionId });
    if (!user || session?.userId != userId) throw new UnauthorizedException();
    if (!session || session.isActive) {
      throw new InternalServerErrorException('Session is still active');
    }
    const quiz = await this.QuizModel.findById({quizId:session.quizId});
    let score = 0;
    session.Responses.forEach((response)=>{
      const questionId = response.questionId;
      const correctOption = quiz?.questions.find((question) => question.questionId === questionId)?.answer;
      score += Number(correctOption === response.chosenOption[0])
    });
    await this.AttemptsModel.updateOne({sessionId},{score});
    const newAverageScore = (user.averageScore * (user.quizAttempted - 1) + score) / user.quizAttempted;
    await this.UserModel.updateOne({userId},{averageScore:newAverageScore});
    return {
      messaage:'Score fetched',
      data: score
    }
  }
}
