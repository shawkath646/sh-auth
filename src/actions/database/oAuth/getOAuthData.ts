"use server";
import { db } from "@/config/firebase.config";
import { PrepareOAuthDataType } from "@/types/types";

export async function getOAuthDataByAuthCode(authCode: string) {
    const querySnapshot = await db.collection("OAuthRequests").where("authCode.code", "==", authCode).get();
    if (querySnapshot.docs.length === 0) return false;
    return querySnapshot.docs[0].data() as PrepareOAuthDataType;
}