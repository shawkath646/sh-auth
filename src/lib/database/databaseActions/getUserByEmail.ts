"use server";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { db } from "../firebase";
import { EmailType } from "@/types/types";


export default async function getUserByEmail(userEmail: string) {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9]+$/;

    let filteredUser: QueryDocumentSnapshot[] = [], usernameType;

    if (emailRegex.test(userEmail)) usernameType = "email";
    else if (usernameRegex.test(userEmail)) usernameType = "username";
    else return;

    if (usernameType === "username") {
        const userQuerySnapshot = await db.collection('userData').where('username', '==', userEmail).get();
        filteredUser = userQuerySnapshot.docs;
    } else if (usernameType === "email") {
        const cleanedLocalPart = userEmail.split('@')[0].replace(/\./g, '');
        const cleanedEmail = `${cleanedLocalPart}@${userEmail.split('@')[1]}`;

        const userQuerySnapshot = await db.collection('userData').get();
        filteredUser = userQuerySnapshot.docs.filter((doc: QueryDocumentSnapshot) => {
            const emailArray = doc.data().contactInfo.email;
            return emailArray.some((entry: EmailType) => entry.address === cleanedEmail);
        });
    }

    if (filteredUser.length === 0) return;

    return filteredUser[0];
}