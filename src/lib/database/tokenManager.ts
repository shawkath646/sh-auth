"use server";
import jwt from "jsonwebtoken";
import getAppData from "./getAppData";
import { db } from "@/lib/database/firebase";
import { PayloadType } from "@/types/gettedUserDataType";
import { LoginHistory } from '@/types/gettedUserDataType';

export default async function tokenManager(payload: PayloadType) {
    const secretKey = process.env.JWT_AUTH_SECRET || 'GOFAR_(59)+10';
    const refreshTokenExpire = Number(process.env.REFRESH_TOKEN_EXPIRE) || 604800;
    const authTokenExpire  = Number(process.env.AUTH_TOKEN_EXPIRE) || 600;

    const todayDate = new Date();
    const currentTime = todayDate.getTime();

    const appData = await getAppData(payload.app_id);

    function verifyToken(token: string) {
        try {
            jwt.verify(token, secretKey)
            return true;
        } catch (err) {
            return false;
        }
    }

    async function getAuthToken(refresh_token: string) {
        payload.refresh_token = refresh_token;
        const token = jwt.sign(payload, secretKey, { expiresIn: authTokenExpire });
        const expireOn = new Date(currentTime + (authTokenExpire * 1000));
        return { token, expireOn };
    }

    async function getRefreshToken(loginHistory: LoginHistory) {
        const token = jwt.sign(payload, secretKey, { expiresIn: refreshTokenExpire });
        const expireOn = new Date(currentTime + (refreshTokenExpire * 1000));

        const refreshToken = { token, expireOn };
        loginHistory.refreshToken = refreshToken;
        loginHistory.timestamp = todayDate;

        await db.runTransaction(async(transaction: any) => {
            const updatedLoginHistory = appData.data.login_history || [];

            const index = updatedLoginHistory.findIndex((entry: LoginHistory) => entry.clientIp === loginHistory.clientIp);

            if (index !== -1) updatedLoginHistory.splice(index, 1, loginHistory);
            else updatedLoginHistory.push(loginHistory);

            transaction.update(appData.ref, { loginHistory: updatedLoginHistory });
        });

        return refreshToken;
    }


    return { verifyToken, getAuthToken, getRefreshToken };
}
