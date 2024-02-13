"use server";
import { Session } from "next-auth";
import { redirect } from "next/navigation";
import { auth } from "@/app/auth";
import tokenManager from "@/lib/database/tokenManager";
import getAppData from "@/lib/database/getAppData";
import { PagePropsType } from "@/types/gettedUserDataType";



export default async function pageValidation(props: PagePropsType) {
    const { app_id, auth_token, callback_url } = props.searchParams;

    let resolvedAppId: string | undefined;
    let resolvedAuthToken: string | undefined;
    let resolvedCallbackUrl: string | undefined;

    if (Array.isArray(app_id)) resolvedAppId = app_id[0];
    else resolvedAppId = app_id;

    if (Array.isArray(auth_token)) resolvedAuthToken = auth_token[0];
    else resolvedAuthToken = auth_token;

    if (Array.isArray(callback_url)) resolvedCallbackUrl = callback_url[0];
    else resolvedCallbackUrl = callback_url;

    //if (!resolvedAppId || !resolvedAuthToken || !resolvedCallbackUrl) return redirect("/error?code=M019");

    //const { verifyToken } = await tokenManager({ app_id: resolvedAppId });

    //const verifyResult = verifyToken(resolvedAuthToken);

    //if (!verifyResult) redirect("/error?code=M002");

    const requestedAppData = await getAppData('sh-portfolio-maker');

    const stockAppId  = process.env.STOCK_APP_ID || 'sh_authentication_system';

    const stockAppData = await getAppData(stockAppId);

    const serverSession = await auth() as Session;

    const callbackUrl = `app_id=${resolvedAppId}&auth_token=${resolvedAuthToken}&callback_url=${resolvedCallbackUrl}`;

    return { stockAppData, requestedAppData, callbackUrl, serverSession };
}