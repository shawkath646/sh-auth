"use server";
import getBrandData from "@/actions/database/getBrandData";
import getAppData from "@/actions/database/getAppData";
import timeStampToDate from "@/utils/timeStampToDate";
import { AppBasicDataType, AppDataType, BrandDataType, ResolvedAppDataType } from "@/types/types";



export default async function getAppBasicData(): Promise<AppBasicDataType> {

    // replace it later

    const brandData = await getBrandData() as BrandDataType;

    const stockAppId = process.env.STOCK_APP_ID || "sh-authentication-system";
    const stockAppDoc = await getAppData(stockAppId);
    const stockAppData = stockAppDoc.data as AppDataType;

    stockAppData.createdOn = await timeStampToDate(stockAppData.createdOn);

    const stockAppDataResolved = {
        appIcon: stockAppData.appIcon,
        appName: stockAppData.appName,
        author: stockAppData.author,
        createdOn: stockAppData.createdOn,
        version: stockAppData.version,
        website: stockAppData.website,
        privacyPolicy: stockAppData.privacyPolicy,
        contact: stockAppData.contact,
    } as ResolvedAppDataType;

    return {
        stockAppData: stockAppDataResolved,
        brandData,
    }
}