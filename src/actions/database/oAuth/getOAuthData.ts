import { cache } from "react";
import { db } from "@/config/firebase.config";
import { PrepareOAuthDataType } from "@/types/types";
import timeStampToDate from "@/utils/timeStampToDate";


const getOAuthDataByAuthCode = cache(async(authCode: string) => {
    const querySnapshot = await db.collection("OAuthRequests").where("authCode.code", "==", authCode).get();
    if (querySnapshot.empty) return null;
    const data = querySnapshot.docs[0].data() as PrepareOAuthDataType;
    data.accessToken.expireOn = timeStampToDate(data.accessToken.expireOn);
    data.refreshToken.expireOn = timeStampToDate(data.refreshToken.expireOn);
    data.idToken.expireOn = timeStampToDate(data.idToken.expireOn);
    return data;
})

export { getOAuthDataByAuthCode };