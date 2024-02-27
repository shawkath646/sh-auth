"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/actions/otherActions/tokenManager";
import { CookieJsonType } from "@/types/types";


export default async function getOAuthInformationCookie(): Promise<CookieJsonType> {
    const cookieStore = cookies();
    const authData = cookieStore.get("recieved_response");
    if (!authData?.value) return redirect("/error?code=M007");
    const decodedAuthData = verifyToken(authData.value) as CookieJsonType;
    if (!decodedAuthData) return redirect("/error?code=M008");
    return decodedAuthData;
}