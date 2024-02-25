"use server";
import jwt from "jsonwebtoken";
import getAppData from "../database/getAppData";
import { db } from "@/config/firebase.config";
import { PayloadType, CookieJsonType } from "@/types/types";
import { LoginHistoryType } from '@/types/types';

const secretKey = process.env.JWT_AUTH_SECRET || '2780a4d8341f0a312f093765120aac9f';
const refreshTokenExpire = Number(process.env.REFRESH_TOKEN_EXPIRE) || 604800;
const authTokenExpire  = Number(process.env.RESPONSE_EXPIRE) || 3600;

const todayDate = new Date();
const currentTime = todayDate.getTime();

function verifyToken(token: string) {
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    } catch (err) {
        return null;
    }
}

function getAuthToken(appId:string, refreshToken: string) {
    const token = jwt.sign({ appId, refreshToken }, secretKey, { expiresIn: authTokenExpire });
    const expireOn = new Date(currentTime + (authTokenExpire * 1000));
    return { token, expireOn };
}

async function getCookieToken(cookieJson: CookieJsonType) {
    return jwt.sign(cookieJson, secretKey, { expiresIn: authTokenExpire });
}


async function getRefreshToken(payload: PayloadType, loginHistory: LoginHistoryType) {
    const token = jwt.sign(payload, secretKey, { expiresIn: refreshTokenExpire });
    const expireOn = new Date(currentTime + (refreshTokenExpire * 1000));

    const refreshToken = { token, expireOn };
    loginHistory.refreshToken = refreshToken;
    loginHistory.timestamp = todayDate;

    const requestedAppDocData = await getAppData(payload.app_id);

    await db.runTransaction(async(transaction: any) => {
        const updatedLoginHistory = requestedAppDocData.data.loginHistory || [];

        const index = updatedLoginHistory.findIndex((entry: LoginHistoryType) => entry.clientIp === loginHistory.clientIp);

        if (index !== -1) updatedLoginHistory.splice(index, 1, loginHistory);
        else updatedLoginHistory.push(loginHistory);

        transaction.update(requestedAppDocData.ref, { loginHistory: updatedLoginHistory });
    });

    return refreshToken;
}

export { verifyToken, getCookieToken, getAuthToken, getRefreshToken };

