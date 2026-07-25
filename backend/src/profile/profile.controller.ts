import { Body, Controller, Get, HttpCode, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { SanitizeInterceptor } from '../common/interceptors/sanitize.interceptor';
import { ProfileService } from './profile.service';
import { getProfileDto} from './dto/profile.request.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('api/profile')
@UseGuards(JwtAuthGuard)
@UseInterceptors(LoggingInterceptor, SanitizeInterceptor)

export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }
    @HttpCode(200)
    @Get(':email')
    async getProfile(@Param() dto: getProfileDto) {
        return this.profileService.getProfile(dto);
    }
}

