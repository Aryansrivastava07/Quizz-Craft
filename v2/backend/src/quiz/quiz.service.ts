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
        const questions = generatedQuiz.quiz.questions.map((question, idx) => {
          const level = (question as any).level || (idx % 3 === 0 ? 'EASY' : idx % 3 === 1 ? 'MEDIUM' : 'HARD');
          const xp = level === 'EASY' ? 100 : level === 'HARD' ? 300 : 200;
          return {
            ...question,
            questionId: randomUUID(),
            level,
            xp,
            explanation: question.explanation || '',
          };
        });

        const newQuiz: IQuiz = {
          quizId: randomUUID(),
          title: generatedQuiz.quiz.title,
          immediateResult: true,
          questime: 60,
          dynamicShuffle: true,
          temporalLimit: true,
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

  async getQuiz(quizId: string): Promise<ServiceResponse<{ quiz: Quiz & IQuiz; stats?: { peopleAttempted: number; averageScore: number } }>> {
    const quiz = await this.QuizModel.findOne({ quizId });
    if (!quiz) {
      throw new NotFoundException('No Quiz found for this Id');
    }

    const attempts = await this.AttemptsModel.find({ quizId }).lean();
    const peopleAttempted = attempts.length;
    let totalPct = 0;
    let counted = 0;
    const totalQuestions = quiz.questions?.length || 1;
    for (const a of attempts) {
      if (typeof a.score === 'number') {
        const pct = Math.round((a.score / totalQuestions) * 100);
        totalPct += pct;
        counted++;
      }
    }
    const averageScore = counted > 0 ? Math.round(totalPct / counted) : 0;

    return {
      message: 'Quiz fetched successfully',
      data: {
        quiz: quiz.toObject() as Quiz & IQuiz,
        stats: {
          peopleAttempted,
          averageScore,
        },
      },
    };
  }

  async updateQuiz(
    quizId: string,
    updateData: {
      title?: string;
      questions?: any[];
      immediateResult?: boolean;
      questime?: number;
      dynamicShuffle?: boolean;
      temporalLimit?: boolean;
    },
  ): Promise<ServiceResponse<{ updated: boolean }>> {
    const quiz = await this.QuizModel.findOne({ quizId });
    if (!quiz) {
      throw new NotFoundException('No Quiz found for this Id');
    }

    const setPayload: any = {};
    if (updateData.title !== undefined) {
      setPayload.title = updateData.title;
    }
    if (updateData.immediateResult !== undefined) {
      setPayload.immediateResult = updateData.immediateResult;
    }
    if (updateData.questime !== undefined) {
      setPayload.questime = Math.max(30, Math.min(300, Number(updateData.questime)));
    }
    if (updateData.dynamicShuffle !== undefined) {
      setPayload.dynamicShuffle = Boolean(updateData.dynamicShuffle);
    }
    if (updateData.temporalLimit !== undefined) {
      setPayload.temporalLimit = Boolean(updateData.temporalLimit);
    }
    if (Array.isArray(updateData.questions)) {
      setPayload.questions = updateData.questions.map((q) => {
        const level = (q.level || q.difficulty || 'MEDIUM').toUpperCase();
        const xp = level === 'EASY' ? 100 : level === 'HARD' ? 300 : 200;
        return {
          questionId: q.questionId || q.id || randomUUID(),
          question: q.question,
          options: Array.isArray(q.options)
            ? q.options.map((opt: any) => (typeof opt === 'string' ? opt : opt.text))
            : [],
          answer: q.answer !== undefined
            ? String(q.answer)
            : String(q.options?.find?.((opt: any) => opt.correct)?.text || ''),
          explanation: q.explanation || '',
          level,
          xp,
        };
      });
    }

    const result = await this.QuizModel.updateOne(
      { quizId },
      { $set: setPayload },
    );
    if (result.matchedCount === 0) {
      throw new NotFoundException('No Quiz found for this Id');
    }
    return {
      message: 'Quiz updated successfully',
      data: { updated: true },
    };
  }

  async editQuestion(
    quizId: string,
    questionId: string,
    dto: {
      question?: string;
      options?: string[];
      answer?: string;
      explanation?: string;
      level?: string;
    },
  ) {
    const quiz = await this.QuizModel.findOne({ quizId });
    if (!quiz) throw new NotFoundException('No Quiz found for this Id');

    const qIndex = quiz.questions.findIndex((q) => q.questionId === questionId);
    if (qIndex === -1) {
      throw new NotFoundException('Question not found in this quiz');
    }

    const currentQ = quiz.questions[qIndex];
    const qObj = (currentQ as any).toObject ? (currentQ as any).toObject() : currentQ;
    const rawLevel = (dto.level || qObj.level || 'MEDIUM').toUpperCase();
    const level = rawLevel === 'EASY' ? 'EASY' : rawLevel === 'HARD' ? 'HARD' : 'MEDIUM';
    const xp = level === 'EASY' ? 100 : level === 'HARD' ? 300 : 200;

    let updatedOptions = qObj.options;
    if (Array.isArray(dto.options)) {
      updatedOptions = dto.options.map((opt: any) =>
        typeof opt === 'string' ? opt : opt.text,
      );
    }

    const updatedQ = {
      questionId,
      question: dto.question !== undefined ? dto.question : qObj.question,
      options: updatedOptions,
      answer: dto.answer !== undefined ? String(dto.answer) : qObj.answer,
      explanation: dto.explanation !== undefined ? dto.explanation : (qObj.explanation || ''),
      level,
      xp,
    };

    quiz.questions[qIndex] = updatedQ;

    await this.QuizModel.updateOne(
      { quizId },
      { $set: { questions: quiz.questions } },
    );

    return {
      message: 'Question updated successfully',
      data: { question: updatedQ, updated: true },
    };
  }

  async addQuestion(
    quizId: string,
    dto: {
      question: string;
      options: string[];
      answer: string;
      explanation?: string;
      level?: string;
    },
  ) {
    const quiz = await this.QuizModel.findOne({ quizId });
    if (!quiz) throw new NotFoundException('No Quiz found for this Id');

    const rawLevel = (dto.level || 'MEDIUM').toUpperCase();
    const level = rawLevel === 'EASY' ? 'EASY' : rawLevel === 'HARD' ? 'HARD' : 'MEDIUM';
    const xp = level === 'EASY' ? 100 : level === 'HARD' ? 300 : 200;

    const newQuestion = {
      questionId: randomUUID(),
      question: dto.question || 'New Question statement',
      options: Array.isArray(dto.options)
        ? dto.options.map((o: any) => (typeof o === 'string' ? o : o.text))
        : ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      answer: String(dto.answer || '0'),
      explanation: dto.explanation || '',
      level,
      xp,
    };

    await this.QuizModel.updateOne(
      { quizId },
      { $push: { questions: newQuestion } },
    );

    return {
      message: 'Question added successfully',
      data: { question: newQuestion, created: true },
    };
  }

  async deleteQuestion(quizId: string, questionId: string) {
    const quiz = await this.QuizModel.findOne({ quizId });
    if (!quiz) throw new NotFoundException('No Quiz found for this Id');

    await this.QuizModel.updateOne(
      { quizId },
      { $pull: { questions: { questionId } } },
    );

    return {
      message: 'Question deleted successfully',
      data: { deleted: true },
    };
  }

  async createAttempt(dto: attemptQuizDto, userId: string) {
    const quiz = await this.QuizModel.findOne({ quizId: dto.quizId });
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
      const quizAttempted = (user.quizAttempted || 0) + 1;
      await this.UserModel.updateOne({ _id: userId }, { quizAttempted });
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
    const quiz = await this.QuizModel.findOne({ quizId: session.quizId });
    let score = 0;
    session.Responses.forEach((response) => {
      const questionId = response.questionId;
      const correctOption = quiz?.questions.find((question) => question.questionId === questionId)?.answer;
      score += Number(correctOption === response.chosenOption[0]);
    });
    await this.AttemptsModel.updateOne({ sessionId }, { score });
    const userAttemptsCount = Math.max(1, user.quizAttempted || 1);
    const newAverageScore = ((user.averageScore || 0) * (userAttemptsCount - 1) + score) / userAttemptsCount;
    await this.UserModel.updateOne({ _id: userId }, { averageScore: newAverageScore });
    return {
      message: 'Score fetched',
      data: score,
    };
  }
}
