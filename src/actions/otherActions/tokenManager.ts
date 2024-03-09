"use server";
import jwt from "jsonwebtoken";

interface ExtendedParams extends jwt.SignOptions {
    payload?: any;
    secret?: string;
}

const secretKey = process.env.JWT_AUTH_SECRET || '2780a4d8341f0a312f093765120aac9f';

async function verifyToken(token: string) {
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    } catch (err) {
        return null;
    }
}

async function getToken({ payload = {}, secret = secretKey, ...rest }: ExtendedParams) {
    const expireOn = new Date();
    const token = jwt.sign(payload, secret, { ...rest }) as string;
    if (rest && rest.expiresIn) {
        expireOn.setSeconds(expireOn.getSeconds() + Number(rest.expiresIn));
    }
    return { token, expireOn };
}

export { verifyToken, getToken };
