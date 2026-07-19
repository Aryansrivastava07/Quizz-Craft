import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { DbModule } from '../db/db.module';
import { MailModule } from '../mail/mail.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ProfileProviders } from './profile.providers';

@Module({
  imports: [DbModule,MailModule,CacheModule.register(),],
  controllers: [ProfileController],
  providers: [ProfileService,...ProfileProviders]
})
export class ProfileModule {}
