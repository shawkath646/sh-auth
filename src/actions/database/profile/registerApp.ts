"use server";
import { redirect } from "next/navigation";
import { auth } from "@/app/auth";
import registerAppObject from "@/Schema/registerAppObject";
import generateAppSecret from "@/utils/generateAppSecret";
import { db } from "@/config/firebase.config";
import { AppRegisterFormType, CustomSessionType } from "@/types/types";
import uploadImage from "../uploadImage";


function generateAppId(appName: string) {
    const cleanName = appName.trim().toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-');

    function getRandomBlock() {
        return Math.random().toString(36).substring(2, 6);
    }

    const randomBlocks = [getRandomBlock(), getRandomBlock(), getRandomBlock(), getRandomBlock()];
    return `${cleanName}-${randomBlocks.join('-')}`;
}

export default async function registerApp(formData: AppRegisterFormType) {

    const session = await auth() as CustomSessionType;

    registerAppObject.appName = formData.appName;
    registerAppObject.appType = formData.appType as "web application" | "android application" | "ios application" | "native application";
    registerAppObject.id = generateAppId(registerAppObject.appName);
    registerAppObject.appSecret = await generateAppSecret();
    registerAppObject.callbackUrl.push(formData.redirectUrl);
    registerAppObject.contact = formData.contact;
    registerAppObject.version = formData.version;
    registerAppObject.description = formData.description;
    registerAppObject.author = session.user.id;
    registerAppObject.inactiveMessage = formData.inactiveMessage;
    registerAppObject.status = formData.status as "active" | "suspended" | "inactive";
    registerAppObject.privacyPolicy = formData.privacyPolicy;
    registerAppObject.website = formData.website;

    if (formData.appIcon) {
        const uploadImageResponse = await uploadImage(formData.appIcon, `app_icon_${registerAppObject.id}`);
        if (uploadImageResponse.status === "error")  return uploadImageResponse;
        registerAppObject.appIcon = uploadImageResponse.downloadURL;
    }

    await db.collection("apps").doc(registerAppObject.id).set(registerAppObject);

    return redirect(`/auth/profile/applications/manage/${registerAppObject.id}`);
}