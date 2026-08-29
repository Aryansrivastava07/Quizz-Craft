import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Param,
  Get,
  Request,
  Query,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import 'multer'; // Import multer types
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { SanitizeInterceptor } from '../common/interceptors/sanitize.interceptor';
import { generateQuizDto, attemptQuizDto, answerQuizDto } from './dto/quiz.request.dto';
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

  @HttpCode(200)
  @Get('attempt/:quizId')
  async createAttempt(@Param() dto: attemptQuizDto, @Request() req) {
    const userId = req.user.userId;
    return this.quizService.createAttempt(dto, userId);
  }

  @HttpCode(200)
  @Post('attempt/answer/:sessionId')
  async updateResponse(
    @Param('sessionId') sessionId: string,
    @Body() dto: answerQuizDto,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.quizService.updateResponse(sessionId, dto, userId);
  }

  @HttpCode(200)
  @Post('attempt/submit/:sessionId')
  async SubmitResponse(
    @Param('sessionId') sessionId: string,
    @Body() dto: answerQuizDto,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.quizService.submitResponse(sessionId, dto, userId);
  }

  @HttpCode(200)
  @Get('score/:sessionId')
  async GetScore(
    @Param('sessionId') sessionId: string,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.quizService.getScore(sessionId, userId);
  }
}
