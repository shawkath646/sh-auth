import { NextResponse } from "next/server";
import getBrandData from "@/actions/database/getBrandData";
import MesssagesList from "@/JsonData/MessagesList.json";

export async function GET() {

    const responseObject = {
        status: "success",
        message: MesssagesList.M015.message,
        data: await getBrandData()
    }

    return NextResponse.json(responseObject, { status: MesssagesList.M015.code });
}