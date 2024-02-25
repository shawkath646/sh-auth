"use client";
import Link from "next/link";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { AppBasicDataContext } from "@/app/auth/layout";
import LoadingSpinner from "@/components/layout/LoadingSpinner";
import getRequestedAppData from "@/actions/getData/getRequestedAppData";
import useSession from "@/actions/otherActions/useSession";
import getUserAgentData from "@/actions/getData/getUserAgentData";
import formatDate from "@/utils/formatDate";
import { AppBasicDataType, ResolvedAppDataType } from "@/types/types";
import { IoIosArrowForward } from "react-icons/io";
import blankUserProfile from "@/assets/blank_user_profile.png";
import bgBanner from "@/assets/background_signin.jpg";
  
interface PageDataType {
    session: Session;
    userAgent: string;
    requestedAppData: ResolvedAppDataType;
}

export default function Page() {

    const { stockAppData, brandData } = useContext(AppBasicDataContext) as AppBasicDataType;

    const [pageData, setPageData] = useState<PageDataType | null>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const requestedAppData = await getRequestedAppData();
                const session = await useSession();
                const userAgent = await getUserAgentData();
                setPageData({
                    session, userAgent, requestedAppData
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);


    return (
        <>
            <title>User info</title>
            <main className="min-h-screen w-full bg-cover bg-center relative">
                <Image src={bgBanner.src} alt="Background" fill priority />
                <div className="dark:bg-black dark:bg-opacity-50 relative">
                    <div className="min-h-screen container mx-auto flex items-center justify-center">
                        <section className="w-[400px] bg-white dark:bg-gray-900 bg-opacity-95 dark:bg-opacity-95 p-5 lg:p-7 rounded-xl text-black dark:text-gray-200 shadow-lg">
                            {pageData ? (
                                <>
                                    <div className="flex justify-center space-x-2 items-center">
                                        {stockAppData.appIcon && <Image src={stockAppData.appIcon} alt={`${stockAppData.appName} logo`} width={30} height={30} />}
                                        <p className="text-lg font-medium">{stockAppData.appName}</p>
                                    </div>

                                    <div className="relative mx-auto w-[100px] h-[100px]">
                                        <Image src={pageData.session?.user.image || blankUserProfile.src} alt="User profile" width={90} height={90} className={`w-[100px] h-[100px] rounded-full mt-4 border-4 p-1 ${pageData.session?.user.isEnterpriseUser ? "border-yellow-500" : "border-blue-500"}`} />
                                        {pageData.session?.user.isEnterpriseUser && <p className="absolute text-sm bg-yellow-200 text-yellow-600 rounded-2xl px-1.5 py-0.5 font-medium -right-7 bottom-0">Enterprise</p>}
                                    </div>
                                    <p className="text-gray-700 text-center dark:text-gray-300 mt-2">@{pageData.session?.user.username}</p>
                                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 mt-5">
                                        <tbody>
                                            <tr className="dark:bg-gray-800 bg-white border-b dark:border-gray-900">
                                                <th scope="row" className="px-3 py-4 font-medium text-gray-900 dark:text-gray-300 whitespace-nowrap">
                                                    ID
                                                </th>
                                                <td className="px-3 py-4 dark:text-gray-300">
                                                    {pageData.session?.user.id}
                                                </td>
                                            </tr>
                                            <tr className="dark:bg-gray-800 bg-white border-b dark:border-gray-900">
                                                <th scope="row" className="px-3 py-4 font-medium text-gray-900 dark:text-gray-300 whitespace-nowrap">
                                                    Name
                                                </th>
                                                <td className="px-3 py-4 dark:text-gray-300">
                                                    {pageData.session?.user.name}
                                                </td>
                                            </tr>
                                            <tr className="dark:bg-gray-800 bg-white border-b dark:border-gray-900">
                                                <th scope="row" className="px-3 py-4 font-medium text-gray-900 dark:text-gray-300 whitespace-nowrap">
                                                    Date of Birth
                                                </th>
                                                <td className="px-3 py-4 dark:text-gray-300">
                                                    {pageData.session && formatDate(pageData.session.user.dateOfBirth)}
                                                </td>
                                            </tr>
                                            <tr className="dark:bg-gray-800 bg-white border-b dark:border-gray-900">
                                                <th scope="row" className="px-3 py-4 font-medium text-gray-900 dark:text-gray-300 whitespace-nowrap">
                                                    Agent
                                                </th>
                                                <td className="px-3 py-4 dark:text-gray-300">
                                                    {pageData.userAgent}
                                                </td>
                                            </tr>
                                            <tr className="dark:bg-gray-800 bg-white border-b dark:border-gray-900">
                                                <th scope="row" className="px-3 py-4 font-medium text-gray-900 dark:text-gray-300 whitespace-nowrap">
                                                    Requested by
                                                </th>
                                                <td className="px-3 py-4 dark:text-gray-300 flex items-center space-x-2">
                                                    {pageData.requestedAppData.appIcon && <Image src={pageData.requestedAppData.appIcon} width={20} height={20} alt={`${pageData.requestedAppData.appName} logo`} />}
                                                    <p>{pageData.requestedAppData.appName}</p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="flex space-x-2 items-center mt-8">
                                        <button type="button" onClick={() => signOut({ callbackUrl: "/auth/sign-in" })} className="flex items-center justify-center space-x-2 w-full outline-none py-1.5 bg-red-500 bg-opacity-40 border border-red-500 hover:bg-opacity-100 hover:text-white dark:text-gray-200 transition-all mx-auto rounded-md">
                                            <p>Log out</p>
                                            <IoIosArrowForward size={20} />
                                        </button>
                                        <Link href="/auth/callback" className="flex items-center justify-center space-x-2 w-full outline-none py-1.5 bg-blue-500 bg-opacity-40 border border-blue-500 hover:bg-opacity-100 hover:text-white dark:text-gray-200 transition-all mx-auto rounded-md">
                                            <p>Continue</p>
                                            <IoIosArrowForward size={20} />
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center justify-center h-[500px]">
                                    <LoadingSpinner />
                                </div>
                            )}
                        </section>
                    </div>
                </div>

                <footer className="absolute bottom-2 w-full z-30">
                    <p className="text-center text-white dark:text-gray-200 ">{brandData.copyrightText}</p>
                </footer>
            </main>
        </>
    );
}