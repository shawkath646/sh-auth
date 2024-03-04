import type { Metadata } from 'next';
import Image from "next/image";
import { auth } from "@/app/auth";
import getAppData from "@/actions/database/getAppData";
import getBrandData from "@/actions/database/getBrandData";
import getUserAgentData from "@/actions/getData/getUserAgentData";
import formatDate from "@/utils/formatDate";
import ButtonsContainer from "./ButtonsContainer";
import { CustomSessionType } from "@/types/types";
import blankUserProfile from "@/assets/blank_user_profile.png";
import bgBanner from "@/assets/background_signin.jpg";
import timeStampToDate from "@/utils/timeStampToDate";
import getOAuthInformationCookie from "@/actions/oAuth/getOAuthInformationCookie";

export const metadata: Metadata = {
    title: 'User info',
}


export default async function Page() {
    
    const stockAppId = process.env.STOCK_APP_ID;
    const requestedAppId = (await getOAuthInformationCookie()).requestedClientId;
    const stockAppData = await getAppData(stockAppId as string);
    const requestedAppData = await getAppData(requestedAppId);
    const brandData = await getBrandData();
    const session = await auth() as CustomSessionType;
    const userAgent = await getUserAgentData();

    const dateOfBirth = await timeStampToDate(session.user.dateOfBirth);

    return (
        <main className="min-h-screen w-full relative">
            <Image src={bgBanner.src} alt="Background" fill className="object-cover object-center" priority />
            <div className="dark:bg-black dark:bg-opacity-50 relative">
                <div className="min-h-screen container mx-auto flex items-center justify-center">
                    <section className="w-[400px] bg-white dark:bg-gray-900 bg-opacity-95 dark:bg-opacity-95 p-5 lg:p-7 rounded-xl text-black dark:text-gray-200 shadow-lg">
                        <div className="flex justify-center space-x-2 items-center">
                            {stockAppData.appIcon && <Image src={stockAppData.appIcon} alt={`${stockAppData.appName} logo`} width={30} height={30} />}
                            <p className="text-lg font-medium">{stockAppData.appName}</p>
                        </div>

                        <div className="relative mx-auto w-[100px] h-[100px]">
                            <Image src={session.user.image || blankUserProfile.src} alt="User profile" width={90} height={90} className={`w-[100px] h-[100px] rounded-full mt-4 border-4 p-1 ${session.user.isEnterpriseUser ? "border-yellow-500" : "border-blue-500"}`} />
                            {session.user.isEnterpriseUser && <p className="absolute text-sm bg-yellow-200 text-yellow-600 rounded-2xl px-1.5 py-0.5 font-medium -right-7 bottom-0">Enterprise</p>}
                        </div>
                        <p className="text-gray-700 text-center dark:text-gray-300 mt-2">@{session.user.username}</p>
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 mt-5">
                            <tbody>
                                <tr className="dark:bg-gray-800 bg-white border-b dark:border-gray-900">
                                    <th scope="row" className="px-3 py-4 font-medium text-gray-900 dark:text-gray-300 whitespace-nowrap">
                                        ID
                                    </th>
                                    <td className="px-3 py-4 dark:text-gray-300">
                                        {session.user.id}
                                    </td>
                                </tr>
                                <tr className="dark:bg-gray-800 bg-white border-b dark:border-gray-900">
                                    <th scope="row" className="px-3 py-4 font-medium text-gray-900 dark:text-gray-300 whitespace-nowrap">
                                        Name
                                    </th>
                                    <td className="px-3 py-4 dark:text-gray-300">
                                        {session.user.name}
                                    </td>
                                </tr>
                                <tr className="dark:bg-gray-800 bg-white border-b dark:border-gray-900">
                                    <th scope="row" className="px-3 py-4 font-medium text-gray-900 dark:text-gray-300 whitespace-nowrap">
                                        Primary email
                                    </th>
                                    <td className="px-3 py-4 dark:text-gray-300">
                                        {session.user.email}
                                    </td>
                                </tr>
                                <tr className="dark:bg-gray-800 bg-white border-b dark:border-gray-900">
                                    <th scope="row" className="px-3 py-4 font-medium text-gray-900 dark:text-gray-300 whitespace-nowrap">
                                        Date of Birth
                                    </th>
                                    <td className="px-3 py-4 dark:text-gray-300">
                                        {formatDate(dateOfBirth as Date)}
                                    </td>
                                </tr>
                                <tr className="dark:bg-gray-800 bg-white border-b dark:border-gray-900">
                                    <th scope="row" className="px-3 py-4 font-medium text-gray-900 dark:text-gray-300 whitespace-nowrap">
                                        Agent
                                    </th>
                                    <td className="px-3 py-4 dark:text-gray-300">
                                        {userAgent}
                                    </td>
                                </tr>
                                <tr className="dark:bg-gray-800 bg-white border-b dark:border-gray-900">
                                    <th scope="row" className="px-3 py-4 font-medium text-gray-900 dark:text-gray-300 whitespace-nowrap">
                                        Requested by
                                    </th>
                                    <td className="px-3 py-4 dark:text-gray-300 flex items-center space-x-2">
                                        {requestedAppData.appIcon && <Image src={requestedAppData.appIcon} width={20} height={20} alt={`${requestedAppData.appName} logo`} />}
                                        <p>{requestedAppData.appName}</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <ButtonsContainer />
                    </section>
                </div>
            </div>

            <footer className="absolute bottom-2 w-full z-30">
                <p className="text-center text-white dark:text-gray-200 ">{brandData.copyrightText}</p>
            </footer>
        </main>
    );
}