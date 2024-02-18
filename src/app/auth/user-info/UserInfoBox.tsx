"use client";
import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
import { ApplicationBasicDataContext } from "@/app/auth/layout";
import { ApplicationBasicDataType, DateOfBirthType } from "@/types/types";
import { FaUser } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { ImSpinner8 } from "react-icons/im";
import blankUserProfile from "@/assets/blank_user_profile.png";
import { Session } from "next-auth";



export default function UserInfoBox({ session, userAgent }: { session: Session; userAgent: string }) {

    const { stockAppData, requestedAppData } = useContext(ApplicationBasicDataContext) as ApplicationBasicDataType;

    const timeStampToDate = (input: DateOfBirthType | Date): Date => {
        if (input instanceof Date) {
          return input;
        }
        const milliseconds = input._seconds * 1000 + Math.round(input._nanoseconds / 1000000);
        return new Date(milliseconds);
    };
            
    const FormatDate = () => {
        const date = timeStampToDate(session?.user.personalData?.dateOfBirth || new Date());
        const options = { day: '2-digit' as const, month: 'long' as const, year: 'numeric' as const };
        return date.toLocaleDateString('en-US', options);
    };
           
    return (
        <section className="w-[400px] bg-white dark:bg-gray-900 bg-opacity-95 dark:bg-opacity-95 p-5 lg:p-7 rounded-xl text-black dark:text-gray-200 shadow-lg">
            <div className="flex justify-center space-x-2 items-center">
                {stockAppData.appIcon && <Image src={stockAppData.appIcon} alt={`${stockAppData.appName} logo`} width={30} height={30} />}
                <p className="text-lg font-medium">{stockAppData.appName}</p>
            </div>
            {status === "loading" ? (
                <div className="w-full flex items-center justify-center h-[300px]">
                    <div>
                        <ImSpinner8 size={30} className="animate-spin mx-auto" />
                        <p className="text-center font-medium">Please wait...</p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="relative mx-auto w-[100px] h-[100px]">
                        <Image src={session?.user.image || blankUserProfile.src} alt="User profile" width={90} height={90} className={`w-[100px] h-[100px] rounded-full mt-4 border-4 p-1 ${session?.user.isEnterpriseUser ? "border-yellow-500" : "border-blue-500"}`} />
                        {session?.user.isEnterpriseUser && <p className="absolute text-sm bg-yellow-200 text-yellow-600 rounded-2xl px-1.5 py-0.5 font-medium -right-7 bottom-0">Enterprise</p>}
                    </div>
                    <p className="text-gray-700 text-center dark:text-gray-300 mt-2">@{session?.user.username}</p>
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 mt-5">
                        <tbody>
                            <tr className="dark:bg-gray-800 bg-white border-b dark:border-gray-900">
                                <th scope="row" className="px-3 py-4 font-medium text-gray-900 dark:text-gray-300 whitespace-nowrap">
                                ID
                                </th>
                                <td className="px-3 py-4 dark:text-gray-300">
                                {session?.user.id}
                                </td>
                            </tr>
                            <tr className="dark:bg-gray-800 bg-white border-b dark:border-gray-900">
                                <th scope="row" className="px-3 py-4 font-medium text-gray-900 dark:text-gray-300 whitespace-nowrap">
                                    Name
                                </th>
                                <td className="px-3 py-4 dark:text-gray-300">
                                    {session?.user.name}
                                </td>
                            </tr>
                            <tr className="dark:bg-gray-800 bg-white border-b dark:border-gray-900">
                                <th scope="row" className="px-3 py-4 font-medium text-gray-900 dark:text-gray-300 whitespace-nowrap">
                                    Date of Birth
                                </th>
                                <td className="px-3 py-4 dark:text-gray-300">
                                    <FormatDate />
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
                    <div className="flex space-x-2 items-center mt-8">
                        <Link href="/auth/profile" className="flex items-center justify-center space-x-2 w-full outline-none py-1.5 bg-green-500 bg-opacity-40 border border-green-500 hover:bg-opacity-100 hover:text-white dark:text-gray-200 transition-all mx-auto rounded-md">
                            <p>Profile</p>
                            <FaUser size={20} />
                        </Link>
                        <button type="button" className="flex items-center justify-center space-x-2 w-full outline-none py-1.5 bg-blue-500 bg-opacity-40 border border-blue-500 hover:bg-opacity-100 hover:text-white dark:text-gray-200 transition-all mx-auto rounded-md">
                            <p>Continue</p>
                            <IoIosArrowForward size={20} />
                        </button>
                    </div>
                </>
            )}
        </section>
    );
}