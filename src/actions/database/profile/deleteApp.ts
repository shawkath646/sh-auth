"use server";
import { redirect } from "next/navigation";
import { db } from "@/config/firebase.config";
import deleteImageByURL from "@/actions/database/deleteImageByURL";

export default async function deleteApp(appId: string, imageUrl: string) {
    await db.collection("apps").doc(appId).delete();
    imageUrl && await deleteImageByURL(imageUrl);
    return redirect("/auth/profile/applications");
}