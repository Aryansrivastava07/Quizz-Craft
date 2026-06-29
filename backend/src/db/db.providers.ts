import * as mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';

export const Db = [
    {
        provide: 'DATABASE_CONNECTION',
        inject: [ConfigService],
        useFactory: (configService: ConfigService): Promise<typeof mongoose> => {
            const MONGO_URI = configService.get<string>('MONGO_URI');
            // console.log('MONGO_URI:', MONGO_URI);
            if (!MONGO_URI) {
                throw new Error('MONGO_URI environment variable is not defined');
            }
            return mongoose.connect(MONGO_URI);
        },
    },
];
