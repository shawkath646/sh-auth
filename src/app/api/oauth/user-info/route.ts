import { NextRequest, NextResponse } from "next/server";
import MessagesList from "@/JsonData/MessagesList.json";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const params = new URLSearchParams(url.search);

  const accessToken = params.get('access_token');

  if (!accessToken) {
    return NextResponse.json({ message: MessagesList.M019.message }, { status: MessagesList.M019.code });
  }


  const userObject = {

  };

  return NextResponse.json(userObject, { status: 200 });
}
