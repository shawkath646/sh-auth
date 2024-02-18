"use server";
import { cookies } from "next/headers";
import { getCookieToken } from "@/lib/database/tokenManager";
import { verifyToken } from "@/lib/database/tokenManager";
import { CookieJsonType } from "@/types/types";

export default async function validateData(requestedAppId: string, requestedAppAuthToken: string, requestedAppCallbackUrl: string) {

    if (!requestedAppId || !requestedAppAuthToken || !requestedAppCallbackUrl ) return { error: "M019" };

    const verifyResult = verifyToken(requestedAppAuthToken);

    if (!verifyResult)  return false;

    const cookieStore = cookies();

    const cookieJson: CookieJsonType = {
      requestedAppId, requestedAppAuthToken, requestedAppCallbackUrl
    }
    
    const cookieToken = await getCookieToken(cookieJson);

    cookieStore.set("requestedAppData", cookieToken, {
        httpOnly: true,
        secure: true,
        maxAge: Number(process.env.AUTH_TOKEN_EXPIRE) || 3600,
        path: '/auth'
    });

    return true;
}
