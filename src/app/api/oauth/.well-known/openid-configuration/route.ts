import { NextResponse } from "next/server";

interface OIDCReturnType {
    issuer: string;
    authorization_endpoint: string;
    device_authorization_endpoint?: string;
    token_endpoint: string;
    userinfo_endpoint: string;
    revocation_endpoint?: string;
    jwks_uri: string;
    response_types_supported: string[];
    subject_types_supported?: string[];
    id_token_signing_alg_values_supported: string[];
    scopes_supported: string[];
    token_endpoint_auth_methods_supported: string[];
    claims_supported: string[];
    code_challenge_methods_supported?: string[];
    grant_types_supported: string[];
}

const baseURL = process.env.APP_BASE_URL as string;

export async function GET() {

    const oidcConfig: OIDCReturnType = {
        issuer: `${baseURL}/api/oauth`,
        authorization_endpoint: `${baseURL}/api/oauth/request`,
        token_endpoint: `${baseURL}/api/oauth/token`,
        userinfo_endpoint: `${baseURL}/api/oauth/user_info`,
        jwks_uri: `${baseURL}/api/oauth/public_keys`,
        response_types_supported: [
            "code",
            "token",
            "id_token",
            "code token",
            "code id_token",
            "token id_token",
            "code token id_token",
            "none"
        ],
        subject_types_supported: [
            "public"
        ],
        id_token_signing_alg_values_supported: [
            "RS256"
        ],
        scopes_supported: [
            "openid",
            "email",
            "profile"
        ],
        token_endpoint_auth_methods_supported: [
            "client_secret_post",
            "client_secret_basic"
        ],
        claims_supported: [
            "aud",
            "email",
            "email_verified",
            "exp",
            "family_name",
            "given_name",
            "iat",
            "iss",
            "name",
            "picture",
            "sub"
        ],
        code_challenge_methods_supported: [
            "plain",
            "S256"
        ],
        grant_types_supported: [
            "authorization_code",
            "refresh_token",
        ]
    };

    return NextResponse.json(oidcConfig, { status: 200 });
}