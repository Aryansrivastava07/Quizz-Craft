import { Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { QuizProviders } from './quiz.provider';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  controllers: [QuizController],
  providers: [QuizService, ...QuizProviders],
})
export class QuizModule {}
