"use server";
import { redirect } from "next/navigation";
import { DocumentReference } from "firebase-admin/firestore";
import { db } from "@/config/firebase.config";
import { AppDataType } from "@/types/types";

export default async function getAppData(appId: string) {
    const appQuery = await db.collection("apps").where("appId", "==", appId).get();
    const appDoc = appQuery.docs[0];
    if (appQuery.docs.length === 0) return redirect('/error?code=M018');
    return {
        data: appDoc.data() as AppDataType,
        ref: appDoc.ref as DocumentReference
    }
}