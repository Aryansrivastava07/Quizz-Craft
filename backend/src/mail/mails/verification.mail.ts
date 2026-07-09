import { MailConfig } from "../mail.interface";

export const verificationMail: MailConfig<{
  OTP: string;
}> = {
  from: 'QuizzCraft <noreply@quizzcraft.app>',
  subject: 'Verify your QuizzCraft account',
  template: ({ OTP }) => `
    otp: ${OTP}
  `,
};