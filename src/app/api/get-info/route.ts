import { NextRequest, NextResponse } from "next/server";
import getAppData from "@/actions/database/getAppData";
import getBrandData from "@/actions/database/getBrandData";
import { AppDataType } from "@/types/types";
import MesssagesList from "@/JsonData/MessagesList.json";


export async function POST(request: NextRequest) {

    const recieved = await request.json();
    const appId = recieved.client_id, appSecret = recieved.client_secret;
    if (!appId || !appSecret) return NextResponse.json({ status: "error", message: MesssagesList.M019.message }, { status: MesssagesList.M019.code });
    const appInfo: Partial<AppDataType> = await getAppData(appId);
    if (appSecret !== appInfo.appSecret) return NextResponse.json({ status: "error", message: MesssagesList.M002.message }, { status: MesssagesList.M002.code });
    const brandInfo = await getBrandData();

    delete appInfo.appSecret, appInfo.redirectUrl, appInfo.scope;

    return NextResponse.json({ status: "success", message: MesssagesList.M015.message, data: { appInfo, brandInfo } }, { status: MesssagesList.M015.code });
}