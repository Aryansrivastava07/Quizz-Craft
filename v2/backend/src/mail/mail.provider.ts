import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

export const MailProviders = [
    {
        provide: 'RESEND_CLIENT',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
            const RESEND_API_KEY = configService.get<string>('RESEND_API_KEY');
            if (!RESEND_API_KEY) {
                throw new Error('RESEND_API_KEY environment variable is not defined');
            }
            return new Resend(RESEND_API_KEY);
        },
    },
];