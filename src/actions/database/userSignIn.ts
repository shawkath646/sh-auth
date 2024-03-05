"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { BuiltInProviderType } from "@auth/core/providers";
import { signIn } from "@/app/auth";
import getUser from "./getUser";
import { request, verify } from "@/actions/otherActions/twoFactorManager";
import { UserCredintialType, StatusType, TwoStepType } from "@/types/types";
import MessageList from "@/JsonData/MessagesList.json";



interface ExtendedStatusType extends StatusType {
    twoStep: TwoStepType
}

export default async function userSignIn(provider: BuiltInProviderType, credential?: UserCredintialType, twoFactorCode?: number): Promise<StatusType | ExtendedStatusType> {

    let redirectTo;

    const cookieList = cookies();
    const requestedAppCookie = cookieList.get("recieved_response")?.value;
    if (requestedAppCookie) redirectTo = "/auth/user-info";
    else redirectTo= "/auth/profile";

    if (provider === "credentials" && credential) {

        const userData = await getUser(credential.username);

        if (!userData) return {
            status: "error",
            message: MessageList.M020.message,
        };

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