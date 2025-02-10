import { NextFunction, Request, Response } from 'express';
import * as jose from 'jose';

declare global {
    namespace Express {
        interface Request {
            user?: jose.JWTPayload;
        }
    }
}

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: "Token does not exist" });
        return;
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jose.jwtVerify(token, secret);

        req.user = payload;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid Token' });
    }
};
