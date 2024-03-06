import { NextRequest, NextResponse } from "next/server";
import getAppData from "@/actions/database/getAppData";
import getBrandData from "@/actions/database/getBrandData";
import { AppDataType } from "@/types/types";
import MesssagesList from "@/JsonData/MessagesList.json";


export async function POST(request: NextRequest) {

    const recieved = await request.json();
    const appId = recieved.client_id, appSecret = recieved.client_secret;
    if (!appId || !appSecret) return NextResponse.json({ status: "error", message: MesssagesList.M019.message }, { status: MesssagesList.M019.code });
    const appData = await getAppData(appId);
    if (appSecret !== appData.appSecret) return NextResponse.json({ status: "error", message: MesssagesList.M002.message }, { status: MesssagesList.M002.code });
    const brandInfo = await getBrandData();

    const {
        appName,
        appIcon,
        id,
        appType,
        author,
        inactiveMessage,
        version,
        contact,
        createdOn,
        status
    } = appData;

    const appInfo: Partial<AppDataType> = {
        appName,
        appIcon,
        id,
        appType,
        author,
        inactiveMessage,
        version,
        contact,
        createdOn,
        status
    };


    return NextResponse.json({ status: "success", message: MesssagesList.M001.message, data: { appInfo, brandInfo } }, { status: MesssagesList.M001.code });
}