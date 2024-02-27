import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
    const publicKey = {
        "kty": "RSA",
        "e": "AQAB",
        "use": "sig",
        "kid": "ibxVuYLuDUcDUzqH9N-rPCrMlpHjnsO3JldAi7LoqIM",
        "alg": "RS256",
        "n": "i74JvkP3PTzAaGaN5-ZMcLrD_yONwIV4INBL3Ojq78VVa1hO0yRazd2LCJsXTNAt-3RBV6FcxQmJ9q3r3XR5H2PkcyoZq3s5674e-xlhcoNDL54144E1k7DXrNN-ZkUr72OdK1aA6VUaQxvjf-RyhEwd41VH-9qs4vBXXbhN-Z-70V4RZ6lCBBD_gwC7KjN9e6IlIRAPUQrP6-ho6qBS_iKMopmkWpAn233LLCGQIqjEJpZfA0lHngbkv2A-FfLXBLWXVRwsOjARY0nCgggdPryis_U2H7EMYX0GhJkQ8UEmbSE4YraikqdhgP3Vr4xl7zhX8HREKXoNHdIYSpdIIQ"
    }
    console.log("sancsnccndcnsdncsdncdd")
    return NextResponse.json(publicKey, { status: 200 });
}