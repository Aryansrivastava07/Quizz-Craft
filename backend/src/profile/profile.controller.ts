import { Body, Controller, Get, HttpCode, UseInterceptors } from '@nestjs/common';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { SanitizeInterceptor } from '../common/interceptors/sanitize.interceptor';
import { ProfileService } from './profile.service';
import { getProfileDto} from './dto/profile.request.dto'

@Controller('profile')
@UseInterceptors(LoggingInterceptor, SanitizeInterceptor)
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }
    @HttpCode(200)
    @Get('profile/:id')
    async getProfile(@Body() dto: getProfileDto) {
        return this.profileService.getProfile(dto);
    }
}

