import { IsNotEmpty, IsOptional, isString, IsString } from 'class-validator';

export class generateQuizDto {
  @IsString()
  @IsNotEmpty()
  prompt!: string;

  @IsOptional()
  images!: Express.Multer.File[];

  @IsOptional()
  videos!: Express.Multer.File[];

  @IsOptional()
  pdfs!: Express.Multer.File[];
}

export class attemptQuizDto {
  @IsString()
  @IsNotEmpty()
  quizId!: string;
}

export class answerQuizDto {
  @IsString()
  @IsNotEmpty()
  questionId!: string;

  @IsString()
  @IsNotEmpty()
  option!: string;
}