import { Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { QuizProviders } from './quiz.provider';
import { DbModule } from '../db/db.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [DbModule, AiModule],
  controllers: [QuizController],
  providers: [QuizService, ...QuizProviders],
})
export class QuizModule {}
