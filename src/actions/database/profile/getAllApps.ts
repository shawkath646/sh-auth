"use server";
import { db } from "@/config/firebase.config";
import { AppDataType } from "@/types/types";
import timeStampToDate from "@/utils/timeStampToDate";

export default async function getAllApps(userId: string) {
    const appsSnapshot = await db.collection("apps").where("author", "==", userId).get();
    const appDataPromises = appsSnapshot.docs.map(async (e) => {
        const data = e.data() as AppDataType;
        data.createdOn = await timeStampToDate(data.createdOn);
        return data;
    });
    const appData = await Promise.all(appDataPromises);
    return appData;
}
