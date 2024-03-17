"use server";
import getAppData from "@/actions/database/getAppData";

export default async function verifyAuthorization(authorizationCode: string) {
    let decodedString;

    try {
        const filteredAuthorizationCode = authorizationCode.startsWith("Basic ") ? authorizationCode.replace("Basic ", "") : authorizationCode;
        const codeBuffer = Buffer.from(filteredAuthorizationCode, "base64");
        decodedString = codeBuffer.toString('utf8');
    } catch (error) {
        return null;
    }

    const [requestedAppId, requestedAppSecret] = decodedString.split(":");
    const requestedAppData = await getAppData(requestedAppId);
    if (requestedAppData.appSecret !== requestedAppSecret) return null;
    return requestedAppData;
}