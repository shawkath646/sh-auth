"use server";
import { AuthError } from "next-auth";
import { signIn } from "@/app/auth";
import getUserByEmail from "./getUserByEmail";
import { verify } from "./twoFactorManager";
import { UserCredintialType } from "@/types/types";
import MessageList from "@/lib/MessagesList.json";

export default async function userSignInTwoStep(credential: UserCredintialType, twoFactorCode: number) {

    const userDocRef = await getUserByEmail(credential.username);

    if (!userDocRef?.exists) return {
        status: "error",
        message: MessageList.M003.message,
    }

    const twoFactorResult = await verify(twoFactorCode);

    if (!twoFactorResult) return {
        status: "error",
        message: MessageList.M010.message,
    }

    try {
        await signIn("credentials", {
          ...credential,
          redirect: false
        })
    } catch (error) {
        if (error instanceof AuthError) {
          switch (error.type) {
            case "CredentialsSignin":
                return {
                    status: "error",
                    message: MessageList.M021.message,
                }
            default:
                return {
                    status: "error",
                    message: MessageList.M009.message,
                }
          }
        }
    }

    return {
        status: "authenticated",
        message: MessageList.M001.message,
    }
    
}