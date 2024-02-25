"use server";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { db } from "@/config/firebase.config";
import { EmailType } from "@/types/types";


export default async function getUser(info: string) {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9]+$/;

    let filteredUser: QueryDocumentSnapshot[] = [], infoType: "email" | "username";

    if (emailRegex.test(info)) infoType = "email";
    else if (usernameRegex.test(info)) infoType = "username";
    else return;

    if (infoType === "username") {
        const userQuerySnapshot = await db.collection('userData').where('username', '==', info).get();
        filteredUser = userQuerySnapshot.docs;
    } else if (infoType === "email") {
        const cleanedLocalPart = info.split('@')[0].replace(/\./g, '');
        const cleanedEmail = `${cleanedLocalPart}@${info.split('@')[1]}`;

        const userQuerySnapshot = await db.collection('userData').get();
        filteredUser = userQuerySnapshot.docs.filter((doc: QueryDocumentSnapshot) => {
            const emailArray = doc.data().contactInfo.email;
            return emailArray.some((entry: EmailType) => entry.address === cleanedEmail);
        });
    }

    if (filteredUser.length === 0) return;

    return filteredUser[0];
}