import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QuizDocument = HydratedDocument<Quiz>;

@Schema()
export class Quiz {
    @Prop({ required: true })
    quizId!: string;
    
    @Prop({ required: true })
    title!: string;
  
    @Prop({ type: [{ question: String, options: [String], answer: String,explanation: String }] })
    questions!: { question: string; options: string[]; answer: string; explanation: string }[];

}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
