import { Connection } from 'mongoose';
import { UserSchema } from '../schemas/user.schema';
import { QuizSchema } from '../schemas/quiz.schema';
import { AttemptsSchema } from '../schemas/attempts.schema';

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
  {
    provide: 'ATTEMPTS_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('attempts', AttemptsSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
