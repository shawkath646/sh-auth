import { NextRequest, NextResponse } from "next/server";
import * as crypto from "crypto";
import { getOAuthDataByAuthCode } from "@/actions/database/oAuth/getOAuthData";
import verifyAuthorization from "@/actions/oAuth/verifyAuthorization";


export async function POST(request: NextRequest) {

    const authorizationCode = request.headers.get("authorization");
    if (!authorizationCode) return NextResponse.json({ error_description: "This request is invalid due to the absence of required credential fields.", error: "invalid_request" }, { status: 301 });
    const isAuthorizationCodeValid = await verifyAuthorization(authorizationCode);
    if (!isAuthorizationCodeValid) return NextResponse.json({ error_description: "The provided access grant is invalid, expired, or revoked.", error: "invalid_grant" }, { status: 400 });

    const resolvedURL = new URL(await request.text(), request.url);
    const searchParams = new URLSearchParams(resolvedURL.toString());

    const requestedGrantType = searchParams.get("grant_type");
    const requestedCode = searchParams.get("code");
    const requestedCodeVerifier = searchParams.get("code_verifier");

    

    const now = new Date();
    if (requestedGrantType === "authorization_code" && requestedCode) {
        
        const recievedData = await getOAuthDataByAuthCode(requestedCode);
        if (!recievedData) return NextResponse.json({ error_description: "The provided access grant is invalid, expired, or revoked.", error: "invalid_grant" }, { status: 400 });

        let codeVerifierValid: boolean = false;
        if (recievedData.requestData.requestedCodeChallengeMethod === "plain" && requestedCodeVerifier) codeVerifierValid = recievedData.requestData.requestedCodeChallenge === requestedCodeVerifier;
        else if (recievedData.requestData.requestedCodeChallengeMethod === "S256" && requestedCodeVerifier) {
            const codeChallenge = crypto.createHash('sha256').update(requestedCodeVerifier).digest('base64');
            codeVerifierValid = recievedData.requestData.requestedCodeChallenge === codeChallenge.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        }
        if (!codeVerifierValid) return NextResponse.json({ error_desciption: "The provided code challenge is invalid.", error: "invalid_grant" }, { status: 400 });

        const isAuthCodeValid = recievedData.authCode.code !== requestedCode || (now > recievedData.authCode.expireOn);
        if (!isAuthCodeValid) NextResponse.json({ error_description: "Resource owner authentication failed", error: "invalid_grant" }, { status: 400 });


        return NextResponse.json({
            token_type: 'Bearer',
            id_token: recievedData.idToken.token,
            access_token: recievedData.accessToken.token,
            expires_in: Number(process.env.ACCESS_TOKEN_VALIDITY) || 86400,
            refresh_token: recievedData.refreshToken.token,
        }, { status: 200 });
    }

    return NextResponse.json({ error_description: "The provided access grant is invalid, expired, or revoked.", error: "invalid_grant" }, { status: 400 });
}
