import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import JWT from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private configService: ConfigService
    ) { }
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const token = request.cookies?.accessToken
        if (!token) {
            throw new UnauthorizedException('Access token not found');
        }

        const secretKey = this.configService.get<string>('JWT_ACCESS_SECRET');
        if (!secretKey) {
            throw new UnauthorizedException('Server misconfiguration');
        }

        try {
            const user = JWT.verify(token, secretKey);
            if (!user) return false;
            request.user = user;
            return true;
        }
        catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}