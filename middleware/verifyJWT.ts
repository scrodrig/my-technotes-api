import { NextFunction, Request, Response } from 'express';

const jwt = require('jsonwebtoken');

interface CustomRequest extends Request {
    user?: string;
    roles?: string[];
}

const verifyJWT = (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader: string | undefined =
        req.headers.authorization || (req.headers.Authorization as string | undefined);

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err: Error, decoded: { UserInfo: { username: any; roles: any } }) => {
            if (err) return res.status(403).json({ message: 'Forbidden' });
            req.user = decoded.UserInfo.username;
            req.roles = decoded.UserInfo.roles;
            next();
        },
    );
};

module.exports = verifyJWT;
