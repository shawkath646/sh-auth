"use server";
import { auth } from "@/app/auth";
import timeStampToDate from "@/utils/timeStampToDate";
import { Session } from "next-auth";

export default async function useSession(): Promise<Session> {
    const session = await auth() as Session;
    session.user.dateOfBirth = await timeStampToDate(session.user.dateOfBirth);
    return session;
}