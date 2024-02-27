import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getToken } from "@/actions/otherActions/tokenManager";
import getAppData from "@/actions/database/getAppData";

export async function GET(request: NextRequest) {

    const searchParams = request.nextUrl.searchParams;
    const requestedClientId = searchParams.get("client_id");
    const requestedRedirectUri = searchParams.get("redirect_uri");
    const requestedCodeChallenge = searchParams.get("code_challenge");
    const requestedCodeChallengeMethod = searchParams.get("code_challenge_method");
    const requestedScope = searchParams.get("scope");
    const requestedState = searchParams.get("state");
    const requestedNonce = searchParams.get("nonce");
    const requestedResponseType = searchParams.get("response_type");

    if (!requestedClientId || !requestedRedirectUri || !requestedCodeChallenge || !requestedCodeChallengeMethod || !requestedScope || !requestedResponseType || !requestedState || !requestedNonce) return NextResponse.redirect(new URL("/error?code=M019", request.url));

    const response = { requestedClientId, requestedRedirectUri, requestedCodeChallenge, requestedCodeChallengeMethod, requestedScope, requestedResponseType, requestedState, requestedNonce };

    const requestedAppDoc = await getAppData(response.requestedClientId);
    const requestedAppData = requestedAppDoc.data;
    if (requestedAppData.isSuspended) return NextResponse.redirect(new URL("/error?code=M013", request.url));
    if (requestedAppData.scope !== response.requestedScope) return NextResponse.redirect(new URL("/error?code=M012", request.url));
    if (!requestedAppData.callbackUrl.includes(response.requestedRedirectUri)) return NextResponse.redirect(new URL("/error?code=M011", request.url));

    const cookieValidity = Number(process.env.OAUTH_COOKIE_VALIDITY) || 600;

    const cookieStore = cookies();
    const { token: cookieToken } = getToken({ payload: response, expiresIn: cookieValidity });

    cookieStore.set("recieved_response", cookieToken, {
        httpOnly: true,
        secure: true,
        maxAge: cookieValidity,
    });

    return NextResponse.redirect(new URL("/auth/protected/user-info", request.url));
}