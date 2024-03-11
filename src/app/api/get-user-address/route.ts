import { NextRequest, NextResponse } from "next/server";
import getAppData from "@/actions/database/getAppData";
import getUserById from "@/actions/database/getUserById";
import MesssagesList from "@/JsonData/MessagesList.json";

export async function GET(request: NextRequest) {
    const userId = request.nextUrl.searchParams.get("user_id");
    const appId = request.nextUrl.searchParams.get("client_id");
    const appSecret = request.nextUrl.searchParams.get("client_secret");
    if (!userId || !appId || !appSecret) return NextResponse.json({ status: "error", message: MesssagesList.M019.message }, { status: MesssagesList.M019.code });
    const appInfo = await getAppData(appId);
    if (appSecret !== appInfo.appSecret) return NextResponse.json({ status: "error", message: MesssagesList.M002.message }, { status: MesssagesList.M002.code });
    const userData = await getUserById(userId);
    if (!userData) return NextResponse.json({ status: "error", message: MesssagesList.M020.message }, { status: MesssagesList.M020.code });
    return NextResponse.json({ status: "success", message: MesssagesList.M015.message, data: userData.personalData.address }, { status: MesssagesList.M015.code });
}