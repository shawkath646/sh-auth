"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCookieToken } from "@/actions/otherActions/tokenManager";
import { CookieJsonType, StatusType } from "@/types/types";


export default async function validateOAuthData(response: CookieJsonType): Promise<StatusType> {
  const isValidRedirectUri = true;
  if (!isValidRedirectUri) return redirect("/error?code=M011");

  const cookieStore = cookies();
  const cookieToken = await getCookieToken(response);

  cookieStore.set("recieved_response", cookieToken, {
    httpOnly: true,
    secure: true,
    maxAge: Number(process.env.RESPONSE_EXPIRE) || 3600,
    path: '/auth'
  });

  return {
    status: "registred",
    message: "App request verified successfully"
  }
}
