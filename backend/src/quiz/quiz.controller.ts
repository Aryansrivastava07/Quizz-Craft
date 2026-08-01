import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import 'multer'; // Import multer types
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { SanitizeInterceptor } from '../common/interceptors/sanitize.interceptor';
import { generateQuizDto } from './dto/quiz.request.dto';
import { QuizService } from './quiz.service';

@Controller('api/quiz')
@UseGuards(JwtAuthGuard)
@UseInterceptors(LoggingInterceptor, SanitizeInterceptor)
export class QuizController {
  constructor(private readonly quizService: QuizService) {}
  @HttpCode(200)
  @Post('generate')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'images', maxCount: 5 },
      { name: 'videos', maxCount: 1 },
      { name: 'pdfs', maxCount: 2 },
    ]),
  )
  async generateQuiz(
    @Body() dto: generateQuizDto,
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
      videos?: Express.Multer.File[];
      pdfs?: Express.Multer.File[];
    },
  ) {
    return this.quizService.generateQuiz({ ...dto, ...files });
  }
}
