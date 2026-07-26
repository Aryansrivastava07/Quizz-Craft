import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QuizDocument = HydratedDocument<Quiz>;

@Schema()
export class Quiz {}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
