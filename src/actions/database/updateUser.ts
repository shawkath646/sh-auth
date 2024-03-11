"use server";
import { db } from "@/config/firebase.config";
import { UserDataType } from "@/types/types";

export default async function updateUser(userId: string, partialUserData: Partial<UserDataType>) {
    await db.collection("userData").doc(userId).set(partialUserData, { merge: true });
}