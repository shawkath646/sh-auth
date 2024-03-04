"use server";
import { redirect } from "next/navigation";
import { db } from "@/config/firebase.config";
import { AppDataType } from "@/types/types";

export default async function getAppData(appId: string) {
    const appDoc = await db.collection("apps").doc(appId).get();
    if (!appDoc.exists) return redirect('/error?code=M018');
    return appDoc.data() as AppDataType;
}