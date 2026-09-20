import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QuizDocument = HydratedDocument<Quiz>;

@Schema()
export class Quiz {
  @Prop({ required: true })
  quizId!: string;

  @Prop({ required: true })
  title!: string;

  @Prop({ type: Boolean, default: true })
  immediateResult?: boolean;

  @Prop({ type: Number, default: 60 })
  questime?: number;

  @Prop({ type: Boolean, default: true })
  dynamicShuffle?: boolean;

  @Prop({ type: Boolean, default: true })
  temporalLimit?: boolean;

  @Prop({
    type: [
      {
        questionId: { type: String, required: true },
        question: { type: String, required: true },
        options: { type: [String], required: true },
        answer: { type: String, required: true },
        explanation: { type: String, default: '' },
        level: { type: String, default: 'MEDIUM' },
        xp: { type: Number, default: 200 },
      },
    ],
    required: true,
  })
  questions!: {
    questionId: string;
    question: string;
    options: string[];
    answer: string;
    explanation: string;
    level?: string;
    xp?: number;
  }[];
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
