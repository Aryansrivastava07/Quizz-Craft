import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
