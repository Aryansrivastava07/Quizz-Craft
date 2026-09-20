import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailProviders } from './mail.provider';

@Module({
  providers: [MailService, ...MailProviders],
  exports: [MailService]
})
export class MailModule {}
