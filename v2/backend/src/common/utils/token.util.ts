import JWT from 'jsonwebtoken';
import { EmptyError } from 'rxjs';

export const generateToken = (payload: object, secret: string, expiresIn: string | number): string => {
    return JWT.sign(payload, secret, { expiresIn: expiresIn as JWT.SignOptions['expiresIn'] });
}

export const verifyToken = (token: string, secret: string): object | string => {
    if (!token) return 'Token not found'
    try {
        return JWT.verify(token, secret);
    } catch (error) {
        console.log(error);
        return 'Invalid token';
    }
}