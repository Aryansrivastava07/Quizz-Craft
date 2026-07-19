import { MailConfig } from "../mail.interface";

export const passwordResetMail: MailConfig<{
  OTP: string;
}> = {
  from: 'QuizzCraft <noreply@quizzcraft.app>',
  subject: 'Password Reset Request for QuizzCraft',
  template: ({ OTP }) => `
    otp: ${OTP}
  `,
};