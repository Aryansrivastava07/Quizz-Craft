import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const payload =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? {
            ...exceptionResponse,
            statusCode: status,
            path: request.url,
            timestamp: new Date().toISOString(),
          }
        : {
            statusCode: status,
            path: request.url,
            message: exception.message,
            timestamp: new Date().toISOString(),
          };

    response.status(status).json(payload);
  }
}