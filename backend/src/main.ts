import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { validationPipe } from './common/pipes/validation.pipe';
import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  console.log('Starting the application...', process.env.PORT ?? 5000);
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(cookieParser());

app.useGlobalPipes(new validationPipe());

  app.useGlobalFilters(new HttpExceptionFilter());


  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
