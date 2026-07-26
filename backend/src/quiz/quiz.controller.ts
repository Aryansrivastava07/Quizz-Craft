import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { SanitizeInterceptor } from '../common/interceptors/sanitize.interceptor';
import { QuizService } from './quiz.service';
import { generateQuizDto } from './dto/quiz.request.dto';

@Controller('api/quiz')
@UseGuards(JwtAuthGuard)
@UseInterceptors(LoggingInterceptor, SanitizeInterceptor)
export class QuizController {
  constructor(private readonly quizService: QuizService) {}
  @HttpCode(200)
  @Post('generate')
  async generateQuiz(@Body() dto: generateQuizDto) {
    return this.quizService.generateQuiz(dto);
  }
}
