import { NextRequest, NextResponse } from "next/server";
import * as crypto from "crypto";
import { getOAuthDataByAuthCode } from "@/actions/database/oAuth/getOAuthData";

interface ResponseType {
    redirect_uri: string;
    code_verifier: "SHA256" | "plain";
    code: string;
    grant_type: "authorization_code"
    | "refresh_token"
    | "urn:ietf:params:oauth:grant-type:device_code"
    | "urn:ietf:params:oauth:grant-type:jwt-bearer"
}

export async function POST(request: NextRequest) {

    const recievedResponse = await request.text();
    const decodedResponse = decodeURIComponent(recievedResponse);
    let responseAsObject;
    const now = new Date();

    try {
        responseAsObject = JSON.parse('{"' + decodedResponse.replace(/&/g, '","').replace(/=/g, '":"') + '"}') as ResponseType;
    } catch (error) {
        return NextResponse.json({ error_description: "Missing or invalid parameter", error: "invalid_request" }, { status: 301 });
    }

    if (responseAsObject.grant_type === "authorization_code" && responseAsObject.code) {

        const recievedData = await getOAuthDataByAuthCode(responseAsObject.code);
        if (!recievedData) return NextResponse.json({ error_description: "The provided access grant is invalid, expired, or revoked.", error: "invalid_grant" }, { status: 400 });
        
        let codeVerifierValid: boolean = false;
        if (recievedData.requestData.requestedCodeChallengeMethod === "plain") codeVerifierValid =  recievedData.requestData.requestedCodeChallenge === responseAsObject.code_verifier;
        else if (recievedData.requestData.requestedCodeChallengeMethod === "S256") {
            const codeChallenge = crypto.createHash('sha256').update(responseAsObject.code_verifier).digest('base64');
            codeVerifierValid = recievedData.requestData.requestedCodeChallenge === codeChallenge.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        }
        if (!codeVerifierValid) return NextResponse.json({ error: "Invalid code challenge " }, { status: 400 });

        const isAuthCodeValid = recievedData.authCode.code !== responseAsObject.code || (now > recievedData.authCode.expireOn);
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
