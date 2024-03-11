"use server";
import { db } from "@/config/firebase.config";
import { UserDataType } from "@/types/types";

export default async function getUserById(userId: string): Promise<UserDataType | null> {
    const docRef = await db.collection("userData").doc(userId).get();
    if (!docRef.exists) return null;
    return docRef.data() as UserDataType;
}