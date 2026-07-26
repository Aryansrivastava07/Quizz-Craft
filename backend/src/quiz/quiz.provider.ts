import { Connection } from 'mongoose';
import { UserSchema } from '../schemas/user.schema';
import { QuizSchema } from '../schemas/quiz.schema';

export const QuizProviders = [
  {
    provide: 'USER_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('User', UserSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'QUIZ_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Quiz', QuizSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
