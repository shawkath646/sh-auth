"use server";
import { redirect } from "next/navigation";
import { db } from "../firebase";

export default async function getAppData(appId: string) {
    const appQuery = await db.collection("apps").where("appId", "==", appId).get();
    const appDoc = appQuery.docs[0];
    if (appQuery.docs.length === 0) return redirect('/error?code=M018');
    return {
        data: appDoc.data(),
        ref: appDoc.ref
    }
}