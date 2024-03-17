import { NextRequest, NextResponse } from "next/server";
import getBrandData from "@/actions/database/getBrandData";
import verifyAuthorization from "@/actions/oAuth/verifyAuthorization";
import { AppDataType } from "@/types/types";
import MesssagesList from "@/JsonData/MessagesList.json";


export async function GET(request: NextRequest) {

    const authorizationCode = request.headers.get("authorization");
    if (!authorizationCode) return NextResponse.json({ status: "error", message: MesssagesList.M019.message }, { status: MesssagesList.M019.code });
    const appInfo: Partial<AppDataType> | null = await verifyAuthorization(authorizationCode);
    if(!appInfo) return NextResponse.json({ status: "error", message: MesssagesList.M002.message }, { status: MesssagesList.M002.code });

    const brandInfo = await getBrandData();

    delete appInfo.appSecret, appInfo.redirectUrl, appInfo.scope;

    return NextResponse.json({ status: "success", message: MesssagesList.M015.message, data: { appInfo, brandInfo } }, { status: MesssagesList.M015.code });
}