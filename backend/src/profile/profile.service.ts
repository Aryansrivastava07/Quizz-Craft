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
import { NotFoundError } from 'rxjs';
import { Quiz } from '../schemas/quiz.schema';

@Injectable()
export class ProfileService {
  constructor(
    @Inject('USER_MODEL') private UserModel: Model<User>,
    @Inject('QUIZ_MODEL') private QuizModel: Model<Quiz>,
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
        throw new NotFoundError('User not found');
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
  ): Promise<ServiceResponse<GetQuizzesForProfileResponseData>> {
    try {
      const quizzes = await this.QuizModel.findById(email).populate('quizzes');
      if (!quizzes) {
        throw new NotFoundError('No Quiz Found for this user');
      }
      return {
        message: 'Quizzes found',
        data: { quizzes: quizzes },
      };
    } catch (error) {
      throw new InternalServerErrorException('Error fetching quizzes');
    }
  }

  async GetHistory(
    email: string,
  ): Promise<ServiceResponse<GetHistoryResponseData>> {
    try {
      const quizzes = await this.QuizModel.findById(email).populate('quizzes');
      if (!quizzes) {
        throw new NotFoundError('No History Found for this user');
      }
      return {
        message: 'Quizzes found',
        data: { quizzes: quizzes },
      };
    } catch (error) {
      throw new InternalServerErrorException('Error fetching quizzes');
    }
  }
}
