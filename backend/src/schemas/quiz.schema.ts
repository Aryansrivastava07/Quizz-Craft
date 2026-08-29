import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QuizDocument = HydratedDocument<Quiz>;

@Schema()
export class Quiz {
  @Prop({ required: true })
  quizId!: string;

  @Prop({ required: true })
  title!: string;

  @Prop({
    type: [
      {
        questionId: { type: String, required: true },
        question: { type: String, required: true },
        options: { type: [String], required: true },
        answer: { type: String, required: true },
        explanation: { type: String, required: true },
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
  }[];
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
