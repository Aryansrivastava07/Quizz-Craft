import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, any>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((res: any) => {
        if (!res.message) throw new Error('Message is not defined');
        return {
          success: true,
          statusCode: response.statusCode,
          message: res?.message,
          data: res?.data !== undefined ? res.data : res,
        };
      }),
    );
  }
}