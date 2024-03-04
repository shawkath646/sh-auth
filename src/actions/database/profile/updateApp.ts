"use server";
import { db } from "@/config/firebase.config";
import uploadImage from "../uploadImage";
import { AppDataType, AppRegisterFormType, StatusType } from "@/types/types";
import getAppData from "../getAppData";

export default async function updateApp(appId: string, data:AppRegisterFormType, redirectUrlList: string[]): Promise<StatusType> {

    const appData = await getAppData(appId);

    const updateObject: Partial<AppDataType> = {
        appName: data.appName,
        appType: data.appType as "web application" | "android application" | "ios application" | "native application",
        callbackUrl: redirectUrlList,
        contact: data.contact,
        description: data.description,
        inactiveMessage: data.inactiveMessage,
        privacyPolicy: data.privacyPolicy,
        status: appData.status === "suspended" ? "suspended" :  data.status as "active" | "inactive",
        version: data.version,
        website: data.website,
    }

    if (data.appIcon) {
        const uploadImageResponse = await uploadImage(data.appIcon, `app_icon_${appId}`, appData.appIcon);
        if (uploadImageResponse.status === "error")  return uploadImageResponse;
        updateObject.appIcon = uploadImageResponse.downloadURL;
    }
    await db.collection("apps").doc(appId).set(updateObject, { merge: true });

    return {
        status: "success",
        message: "App updated successfully"
    };
}