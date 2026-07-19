import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthProviders } from './auth.providers';
import { DbModule } from '../db/db.module';
import { MailModule } from '../mail/mail.module';
import { CacheModule } from '@nestjs/cache-manager';
@Module({
  imports: [DbModule,MailModule,CacheModule.register(),],
  controllers: [AuthController],
  providers: [AuthService, ...AuthProviders,],
})
export class AuthModule {}
