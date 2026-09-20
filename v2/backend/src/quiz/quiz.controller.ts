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
  Put,
  Delete,
  Request,
  Query,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import type {} from 'multer'; // Type-only import without runtime dependency
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { SanitizeInterceptor } from '../common/interceptors/sanitize.interceptor';
import {
  generateQuizDto,
  attemptQuizDto,
  answerQuizDto,
  editQuestionDto,
} from './dto/quiz.request.dto';
import { QuizService } from './quiz.service';

@Controller('api/quiz')
@UseInterceptors(LoggingInterceptor, SanitizeInterceptor)
export class QuizController {
  constructor(private readonly quizService: QuizService) {}
  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get('attempt/:quizId')
  async createAttempt(@Param() dto: attemptQuizDto, @Request() req) {
    const userId = req.user.userId;
    return this.quizService.createAttempt(dto, userId);
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get('score/:sessionId')
  async GetScore(
    @Param('sessionId') sessionId: string,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.quizService.getScore(sessionId, userId);
  }

  @HttpCode(200)
  @Get(':quizId')
  async getQuiz(@Param('quizId') quizId: string) {
    return this.quizService.getQuiz(quizId);
  }

  @HttpCode(200)
  @Put(':quizId')
  async updateQuiz(
    @Param('quizId') quizId: string,
    @Body()
    body: {
      title?: string;
      questions?: any[];
      immediateResult?: boolean;
      questime?: number;
      dynamicShuffle?: boolean;
      temporalLimit?: boolean;
    },
  ) {
    return this.quizService.updateQuiz(quizId, body);
  }

  @HttpCode(200)
  @Put(':quizId/question/:questionId')
  async editQuestion(
    @Param('quizId') quizId: string,
    @Param('questionId') questionId: string,
    @Body() dto: editQuestionDto,
  ) {
    return this.quizService.editQuestion(quizId, questionId, dto);
  }

  @HttpCode(200)
  @Post(':quizId/question')
  async addQuestion(
    @Param('quizId') quizId: string,
    @Body() dto: { question: string; options: string[]; answer: string; explanation?: string; level?: string },
  ) {
    return this.quizService.addQuestion(quizId, dto);
  }

  @HttpCode(200)
  @Delete(':quizId/question/:questionId')
  async deleteQuestion(
    @Param('quizId') quizId: string,
    @Param('questionId') questionId: string,
  ) {
    return this.quizService.deleteQuestion(quizId, questionId);
  }
}
