import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/app/auth";
import SignInBox from "./SignInBox";
import { CustomSessionType } from "@/types/types";

export const metadata: Metadata = {
    title: "Sign in"
}

export default async function Page() {

    const session = await auth() as CustomSessionType;

    if (session && session.user) {
        if (session.user.oldUser) redirect("/auth/user-info");
        else redirect("/auth/sign-up");
    }
    
    return <SignInBox />
}