import jwt from 'jsonwebtoken';
import { SETTINGS } from '../../configs/settings';

export interface JwtPayload {
    userId: string;
    userLogin: string;
}

export class JwtService {
    static createJWT(userId: string, userLogin: string): string {
        return jwt.sign({ userId, userLogin }, SETTINGS.JWT_SECRET, { expiresIn: '1h' });
    }

    static verifyToken(token: string): JwtPayload | null {
        try {
            return jwt.verify(token, SETTINGS.JWT_SECRET) as JwtPayload;
        } catch (e) {
            return null;
        }
    }
}