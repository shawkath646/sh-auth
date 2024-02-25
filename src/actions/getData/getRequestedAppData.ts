"use server";
import { ResolvedAppDataType } from "@/types/types";
import getAppData from "@/actions/database/getAppData";
import getOAuthData from "@/actions/oAuth/getOAuthData";
import timeStampToDate from "@/utils/timeStampToDate";

export default async function getRequestedAppData(): Promise<ResolvedAppDataType> {
    const oAuthAppData = await getOAuthData();
    const requestedAppDoc = await getAppData(oAuthAppData.requestedClientId);
    const requestedAppData = requestedAppDoc.data;

    requestedAppData.createdOn = await timeStampToDate(requestedAppData.createdOn);

    const requestedAppDataResolved = {
        appIcon: requestedAppData.appIcon,
        appName: requestedAppData.appName,
        author: requestedAppData.author,
        version: requestedAppData.version,
        website: requestedAppData.website,
        privacyPolicy: requestedAppData.privacyPolicy,
        contact: requestedAppData.contact,
        createdOn: requestedAppData.createdOn
    }
    
    return requestedAppDataResolved;
}