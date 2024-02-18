import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Session } from "next-auth";
import { auth } from "@/app/auth";
import SignUpBox from "./SignUpBox";

export const metadata: Metadata = {
    title: "Sign up"
}

export default async function Page() {
    const session = await auth() as Session;

    if (session.user.oldUser) redirect("/auth/user-info");

    return <SignUpBox session={session} />
}