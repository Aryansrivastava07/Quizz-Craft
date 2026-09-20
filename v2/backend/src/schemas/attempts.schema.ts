import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AttemptsDocument = HydratedDocument<Attempts>;

@Schema()
export class Attempts {
  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true })
  quizId!: string;

  @Prop({ required: true })
  isActive!: boolean;

  @Prop({ required: true, unique: true })
  sessionId!: string;

  @Prop({ required: true })
  lastUpdateAt!: string;

  @Prop({
    type: [
      {
        questionId: { type: String, required: true },
        chosenOption: { type: [String], required: true },
      },
    ],
    default: [],
  })
  Responses!: { questionId: string; chosenOption: string[] }[];

  @Prop({ required: true, default: null })
  score!: number;
}

export const AttemptsSchema = SchemaFactory.createForClass(Attempts);
