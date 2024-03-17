import { NextRequest, NextResponse } from "next/server";
import verifyAuthorization from "@/actions/oAuth/verifyAuthorization";
import getUserById from "@/actions/database/getUserById";
import MesssagesList from "@/JsonData/MessagesList.json";

export async function GET(request: NextRequest) {
    const authorizationCode = request.headers.get("authorization");
    const userId = request.nextUrl.searchParams.get("user_id");
    if (!userId || !authorizationCode) return NextResponse.json({ status: "error", message: MesssagesList.M019.message }, { status: MesssagesList.M019.code });
    const appInfo = await verifyAuthorization(authorizationCode);
    if (!appInfo) return NextResponse.json({ status: "error", message: MesssagesList.M002.message }, { status: MesssagesList.M002.code });
    if (!appInfo.scope.includes("advanced")) return NextResponse.json({ status: "error", message: MesssagesList.M012.message }, { status: MesssagesList.M012.code });
    const userData = await getUserById(userId);
    if (!userData) return NextResponse.json({ status: "error", message: MesssagesList.M020.message }, { status: MesssagesList.M020.code });
    return NextResponse.json({ status: "success", message: MesssagesList.M015.message, data: userData.personalData.address }, { status: MesssagesList.M015.code });
}