import { NextResponse, type NextRequest } from 'next/server';
import getAppData from '@/actions/database/getAppData';
import { getAuthToken, getRefreshToken, verifyToken } from '@/actions/otherActions/tokenManager';
import MessagesList from '@/lib/MessagesList.json';

export async function POST(req: NextRequest) {

    const recievedData = await req.json();

    const payload = recievedData.payload;

    let authToken, refreshToken;

    if (payload?.app_id && payload?.refresh_token && verifyToken(payload.refresh_token)) authToken = getAuthToken(payload.app_id, payload?.refresh_token);

    else if (payload?.app_id && payload?.app_secret) {
        
        const clientIp = req.headers.get("x-forwarded-for") || '';

        const userAgent = req.headers.get("user-agent") || '';

        const response = await fetch(`http://ip-api.com/json/${clientIp}`);
        const clientLocation = await response.json();

        const requestedAppDocData = await getAppData(payload?.app_id);

        if (payload.app_secret !== requestedAppDocData.data.appSecret) return NextResponse.json({ success: false, message: MessagesList.M017.message }, { status: MessagesList.M017.code });

        refreshToken = await getRefreshToken(payload, { userAgent, clientIp, clientLocation });
        authToken = getAuthToken(payload.app_id, refreshToken.token);
        
    } else return NextResponse.json({ success: false, message: MessagesList.M019.message }, { status: MessagesList.M019.code });

    return NextResponse.json({
        success: true,
        message: MessagesList.M001.message,
        data: {
            authToken,
            refreshToken,
        },
    }, { status: MessagesList.M001.code });
};

export async function GET(req: NextRequest) {
    console.log(req.body);

    NextResponse.json({ success: "cscss" });
}