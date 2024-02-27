"use server";
import { redirect } from "next/navigation";
import { auth } from "@/app/auth";
import { CustomSessionType } from "@/types/types";
import timeStampToDate from "@/utils/timeStampToDate";


export default async function useSession(): Promise<CustomSessionType> {
    const session = await auth() as CustomSessionType;
    if (!session.user) redirect("/error");
    console.log(session)
    session.user.dateOfBirth = await timeStampToDate(session.user.dateOfBirth);
    return session;
}