import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { SanitizeInterceptor } from '../common/interceptors/sanitize.interceptor';
import { ProfileService } from './profile.service';
import { getProfileDto, updateProfileDto } from './dto/profile.request.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('api/profile')
@UseGuards(JwtAuthGuard)
@UseInterceptors(LoggingInterceptor, SanitizeInterceptor)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @HttpCode(200)
  @Get()
  async getProfile(@Query() dto: getProfileDto) {
    return this.profileService.getProfile(dto);
  }

  @HttpCode(201)
  @Post()
  async UpdateProfile(@Req() req, @Body() dto: updateProfileDto) {
    if (req.user.email !== dto.email) {
      return { message: 'Unauthorized', data: {} };
    }
    return this.profileService.UpdateProfile(dto);
  }

  @HttpCode(200)
  @Get('quizzes')
  async GetQuizzesForProfile(@Req() req) {
    const { email } = req.user;
    return this.profileService.GetQuizzesForProfile(email);
  }

  @HttpCode(200)
  @Get('history')
  async GetHistory(@Req() req) {
    const { email } = req.user;
    return this.profileService.GetHistory(email);
  }
}
