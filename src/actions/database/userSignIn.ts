"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn } from "@/app/auth";
import { DocumentData } from "firebase-admin/firestore";
import getUser from "./getUser";
import { request, verify } from "@/actions/otherActions/twoFactorManager";
import { UserDataType, UserCredintialType, StatusType, TwoStepType } from "@/types/types";
import MessageList from "@/JsonData/MessagesList.json";
import { BuiltInProviderType } from "@auth/core/providers";


interface ExtendedDocumentData extends DocumentData, UserDataType { };
interface ExtendedStatusType extends StatusType {
    twoStep: TwoStepType
}

export default async function userSignIn(provider: BuiltInProviderType, credential?: UserCredintialType, twoFactorCode?: number): Promise<StatusType | ExtendedStatusType> {

    let redirectTo;

    const cookieList = cookies();
    const requestedAppCookie = cookieList.get("recieved_response")?.value;
    if (requestedAppCookie) redirectTo = "/auth/protected/user-info";
    else redirectTo= "/auth/protected/profile";

    if (provider === "credentials" && credential) {

        const userDocRef = await getUser(credential.username);

        if (!userDocRef?.exists) return {
            status: "error",
            message: MessageList.M003.message,
        };

        const userData = userDocRef.data() as ExtendedDocumentData;

        if (userData.loginInfo.twoFactor.isEnabled) {
            if (twoFactorCode) {
                const response = await verify(twoFactorCode);
                if (response.status !== "success") return response;
            }
            else return await request(userData) as ExtendedStatusType;
        }

        if (userData.loginInfo.isSuspended) return {
            status: "error",
            message: MessageList.M022.message,
        };


        try {
            await signIn(provider, { ...credential, redirect: false });
        } catch (error) {
            if (error instanceof AuthError) {
                switch (error.type) {
                    case "CredentialsSignin":
                        return {
                            status: "error",
                            message: MessageList.M021.message,
                        };
                    default:
                        return {
                            status: "error",
                            message: MessageList.M009.message,
                        };
                }
            }
        }

        redirect(redirectTo);

    } else {
        await signIn(provider, { redirectTo });
    }

    return {
        status: "authenticated",
        message: "User is authenticated",
    };
}