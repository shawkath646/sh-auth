"use server";
import { headers } from "next/headers";
import { db, fieldValue } from "@/config/firebase.config";

export default async function saveLoginHistory(userId: string) {

    const userDoc = await db.collection("userData").doc(userId).get();

    if (!userDoc.exists) return;

    const headersList = headers();

    const clientIp = headersList.get("x-forwarded-for") || 'Not available';
    const userAgent = headersList.get("user-agent") || 'Not available';

    const response = await fetch(`http://ip-api.com/json/${clientIp}`);
    const clientLocation = await response.json();

    const loginHistory = userDoc.data()?.loginInfo.loginHistory || [];
    const existingIndex = loginHistory.findIndex((history: any) => history.clientIp === clientIp);

    if (existingIndex !== -1) {
        const updatedLoginHistory = [...loginHistory];
        updatedLoginHistory[existingIndex] = { clientIp, userAgent, clientLocation, timestamp: new Date() };

        await userDoc.ref.update({ "loginInfo.loginHistory": updatedLoginHistory });
    } else {
        await userDoc.ref.update({
            "loginInfo.loginHistory": fieldValue.arrayUnion({
                clientIp,
                userAgent,
                clientLocation,
                timestamp: new Date()
            })
        });
    }
}
