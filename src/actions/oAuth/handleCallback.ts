"use server";
import { cookies } from "next/headers";
import { verifyToken } from "../otherActions/tokenManager";
import { CookieJsonType } from "@/types/types";
import { NextResponse } from "next/server";

export default function handleCallback() {

    const cookieStore = cookies();

    const authData = cookieStore.get("recieved_response");

    if (!authData?.value) return JSON.stringify({ error: "M007" });

    const decodedAuthData = verifyToken(authData.value) as CookieJsonType | null;

    if (!decodedAuthData) return JSON.stringify({ error: "M008" });

    const callbackUrl = decodedAuthData.requestedRedirectUri;

    cookieStore.delete("recieved_response");
    
    return NextResponse.redirect(new URL(`${callbackUrl}?code=`))
}