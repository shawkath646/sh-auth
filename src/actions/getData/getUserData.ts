"use server";
import getUser from "../database/getUser";

export default async function getUserData(info: string) {
    const userDoc = await getUser(info);
    if (!userDoc) return;
    return userDoc.data();
}