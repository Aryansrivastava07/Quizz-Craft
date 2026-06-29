import {
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';

export class validationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        return new BadRequestException(
          {
            message: errors.flatMap((err) => Object.values(err.constraints ?? {})),
          }
        );
      },
    });
  }
}