import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';

@Injectable()
export class SanitizeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((res) => {
        try {
          const sanitizeObject = (obj: any): any => {
            if (!obj || typeof obj !== 'object') {
              return obj;
            }

            // Convert Mongoose document to plain object if necessary
            const processedObj =
              typeof obj.toObject === 'function' ? obj.toObject() : { ...obj };

            // Destructure to remove sensitive fields
            const {
              password,
              verificationId,
              verificationIdExpiry,
              refreshToken,
              verified,
              updatedAt,
              __v,
              ...rest
            } = processedObj;

            // Recursively sanitize if there's a nested 'user' object
            if (rest.user && typeof rest.user === 'object') {
              rest.user = sanitizeObject(rest.user);
            }
            return rest;
          };

          if (res && typeof res === 'object') {
            if (res.data !== undefined) {
              // If the response has a 'data' property, sanitize it
              return { ...res, data: sanitizeObject(res.data) };
            } else {
              // If no 'data' property, sanitize the top-level response object itself
              return sanitizeObject(res);
            }
          }
          return res;
        } catch (error) {
          console.error('Error in SanitizeInterceptor:', error);
          return res;
        }
      }),
    );
  }
}
