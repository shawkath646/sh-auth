import { NextRequest, NextResponse } from "next/server";
import getAppData from "@/actions/database/getAppData";
import { AppDataType } from "@/types/types";
import MesssagesList from "@/JsonData/MessagesList.json";

export async function POST(request: NextRequest) {

    const recieved = await request.json();
    if (!recieved.appId || !recieved.appSecret) return NextResponse.json({ status: "error", message: MesssagesList.M019.message }, { status: MesssagesList.M019.code });
    const appData = await getAppData(recieved.appId);
    if (recieved.appSecret !== appData.appSecret) return NextResponse.json({ status: "error", message: MesssagesList.M002.message }, { status: MesssagesList.M002.code });

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

    const appObject: Partial<AppDataType> = {
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

    return NextResponse.json({ status: "success", message: MesssagesList.M001.message, data: appObject }, { status: MesssagesList.M001.code });
}