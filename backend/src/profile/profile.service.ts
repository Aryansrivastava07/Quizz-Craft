import { Inject, Injectable } from '@nestjs/common';
import { ServiceResponse } from '../common/interfaces/service-response.interface';
import { getProfileDto } from './dto/profile.request.dto';
import { getProfileResponseData } from './dto/profile.response.dto';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProfileService {
    constructor(
        @Inject('USER_MODEL') private UserModel: Model<User>
    ) { }
    async getProfile(dto: getProfileDto): Promise<ServiceResponse<getProfileResponseData>> {
        const { email } = dto;
        const user = await this.UserModel.findOne({ email: email }) || {};
        return {
            message: 'User retrieved successfully',
            data: user
        }
    }
}
