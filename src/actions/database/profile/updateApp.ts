"use server";
import { db } from "@/config/firebase.config";
import uploadImage from "../uploadImage";
import { AppDataType, StatusType } from "@/types/types";
import MessageList from "@/JsonData/MessagesList.json"

export default async function updateApp(data: Partial<AppDataType>, oldImageUrl: string): Promise<StatusType> {

    if (!data.id) return {
        status: "error",
        message: MessageList.M019.message
    };

    if (data.appIcon) {
        const uploadImageResponse = await uploadImage(data.appIcon, `app_icon_${data.id}`, oldImageUrl);
        if (uploadImageResponse.status === "error")  return uploadImageResponse;
        data.appIcon = uploadImageResponse.downloadURL;
    }
    await db.collection("apps").doc(data.id).set(data, { merge: true });

    return {
        status: "success",
        message: MessageList.M014.message
    };
}