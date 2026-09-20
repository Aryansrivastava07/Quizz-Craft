import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ServiceResponse } from '../common/interfaces/service-response.interface';
import { getProfileDto, updateProfileDto } from './dto/profile.request.dto';
import {
  GetHistoryResponseData,
  getProfileResponseData,
  GetQuizzesForProfileResponseData,
  updateProfileResponseData,
} from './dto/profile.response.dto';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { Quiz } from '../schemas/quiz.schema';
import { Attempts } from '../schemas/attempts.schema';

@Injectable()
export class ProfileService {
  constructor(
    @Inject('USER_MODEL') private UserModel: Model<User>,
    @Inject('QUIZ_MODEL') private QuizModel: Model<Quiz>,
    @Inject('ATTEMPTS_MODEL') private AttemptsModel: Model<Attempts>,
  ) {}

  async getProfile(
    dto: getProfileDto,
  ): Promise<ServiceResponse<getProfileResponseData>> {
    const { email } = dto;
    const user = await this.UserModel.findOne({ email: email });
    if (!user) {
      return { message: 'User not found', data: {} };
    }
    return {
      message: 'User profile found',
      data: user,
    };
  }

  async UpdateProfile(
    dto: updateProfileDto,
  ): Promise<ServiceResponse<updateProfileResponseData>> {
    const { email, userName } = dto;
    try {
      const user = await this.UserModel.findOne({ email: email });
      if (!user) {
        throw new Error('User not found');
      }
      user.username = userName;
      await user.save();
      return {
        message: 'User profile updated successfully',
        data: { updated: true },
      };
    } catch (error) {
      throw new InternalServerErrorException('Error updating user profile');
    }
  }

  async GetQuizzesForProfile(
    email: string,
  ): Promise<ServiceResponse<{ quizzes: any[] }>> {
    try {
      const quizzes = await this.QuizModel.find().sort({ _id: -1 }).lean();
      return {
        message: 'Quizzes found',
        data: { quizzes },
      };
    } catch (error) {
      console.error('Error in GetQuizzesForProfile:', error);
      throw new InternalServerErrorException('Error fetching quizzes');
    }
  }

  async GetHistory(
    userIdOrEmail: string,
  ): Promise<ServiceResponse<{ history: any[]; quizzes: any[] }>> {
    try {
      const user = await this.UserModel.findOne({
        $or: [{ email: userIdOrEmail }, { username: userIdOrEmail }],
      });
      const userId = user ? (user as any)._id?.toString() : userIdOrEmail;

      const attempts = await this.AttemptsModel.find({
        $or: [
          { userId: userIdOrEmail },
          { userId: String(userId) },
        ],
      })
        .sort({ lastUpdateAt: -1 })
        .lean();

      const quizIds = attempts.map((a) => a.quizId).filter(Boolean);
      const quizzes = await this.QuizModel.find({ quizId: { $in: quizIds } }).lean();
      const quizMap = new Map(quizzes.map((q) => [q.quizId, q]));

      const enrichedHistory = attempts.map((attempt) => {
        const matchingQuiz = quizMap.get(attempt.quizId);
        return {
          ...attempt,
          title: matchingQuiz?.title || 'Interactive Arena Challenge',
          totalQuestions: matchingQuiz?.questions?.length || attempt.Responses?.length || 10,
        };
      });

      return {
        message: 'History found',
        data: {
          history: enrichedHistory,
          quizzes: enrichedHistory,
        },
      };
    } catch (error) {
      console.error('Error in GetHistory:', error);
      throw new InternalServerErrorException('Error fetching history');
    }
  }
}
