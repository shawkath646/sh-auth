import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "@/config/firebase.config";
import timeStampToDate from "@/utils/timeStampToDate";
import { AppDataType } from "@/types/types";


const getAppData = cache(async(appId: string) => {
    const appDoc = await db.collection("apps").doc(appId).get();
    if (!appDoc.exists) return redirect('/error?code=M018');
    const data = appDoc.data() as AppDataType;
    data.createdOn = timeStampToDate(data.createdOn);
    if (data.inactiveUntil) data.inactiveUntil = timeStampToDate(data.inactiveUntil);
    return data;
});

export default getAppData;