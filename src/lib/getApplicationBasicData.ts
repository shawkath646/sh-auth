"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "./database/tokenManager";
import { AppDataType, BrandDataType, CookieJsonType} from "@/types/types";
import getAppData from "./database/databaseActions/getAppData";
import getBrandData from "./database/databaseActions/getBrandData";

export default async function getApplicationBasicData() {
    
    const cookieStore = cookies();

    const authData = cookieStore.get("requestedAppData");

    if (!authData?.value) return JSON.stringify({ error: "M007" });

    const decodedAuthData = verifyToken(authData.value) as CookieJsonType | null;

    if (!decodedAuthData) return JSON.stringify({ error: "M008" });

    const stockAppId = process.env.STOCK_APP_ID || "sh-authentication-system";

    const stockAppDoc = await getAppData(stockAppId);

    const stockAppData = stockAppDoc.data as AppDataType;

    const requestedAppDoc = await getAppData(decodedAuthData.requestedAppId);

    const requestedAppData = requestedAppDoc.data as AppDataType;

    const brandData = await getBrandData() as BrandDataType;

    const applicationBasicData = JSON.stringify({ stockAppData, requestedAppData, brandData });

    return applicationBasicData;
}