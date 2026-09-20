import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { MailModule } from './mail/mail.module';
import { ProfileModule } from './profile/profile.module';
import { CacheModule } from '@nestjs/cache-manager';
import { QuizModule } from './quiz/quiz.module';
import { AiModule } from './ai/ai.module';
import KeyvRedis from '@keyv/redis';

@Module({
  
  imports: [AuthModule, DbModule, ConfigModule.forRoot({
    isGlobal: true,
  }), MailModule, ProfileModule,CacheModule.register({
      isGlobal: true,
      stores: [
        new KeyvRedis('redis://localhost:6379'),
      ],
    }), QuizModule, AiModule,],
  })

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
