import { Inject, Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { verificationMail } from './mails/verification.mail';

@Injectable()
export class MailService {
  constructor(
    @Inject('RESEND_CLIENT')
    private readonly resend: Resend,
  ) {}

  async sendVerificationEmail(
    email: string,
    OTP: string,
  ) {
    const verificationMailConfig = verificationMail;
    return this.resend.emails.send({
      from: verificationMailConfig.from,
      to: email,
      subject: verificationMailConfig.subject,
      html: verificationMailConfig.template({ OTP: OTP}),
    });
  }
}