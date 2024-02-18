"use server";
import getUserByEmail from "./getUserByEmail";

export default async function getUserData(userEmail: string) {
    const userDoc = await getUserByEmail(userEmail);

    if (!userDoc) return;

    return userDoc.data();
}