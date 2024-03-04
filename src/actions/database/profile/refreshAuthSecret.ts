"use server";
import { db } from "@/config/firebase.config";
import generateAppSecret from "@/utils/generateAppSecret";

export default async function refreshAuthSecret(appId: string) {
    const appSecret = await generateAppSecret();
    await db.collection("apps").doc(appId).set({ appSecret }, { merge: true });
    return appSecret;
}