"use client";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { BoxPropsType, DateOfBirth } from "@/types/gettedUserDataType";
import { IoIosArrowForward } from "react-icons/io";
import { IoExitOutline } from "react-icons/io5";
import { ImSpinner8 } from "react-icons/im";


export interface LoginHistory {
    userAgent: string;
    clientIp: string;
    clientLocation: string;
    timestamp?: DateOfBirth | Date;
    refreshToken?: {
      token: string;
      expireOn: Date;
    };
}

interface BoxPropsExtendedType extends BoxPropsType {
    userAgent: string;
}

export default function UserInfoBox({ stockAppData, requestedAppData, callbackUrl, userAgent }: BoxPropsExtendedType) {

    const callbackUrlLink = `/auth/sign-in?${callbackUrl}`;


    const { data: session, status } = useSession({
        required: true,
    });

    const timeStampToDate = (input: DateOfBirth | Date): Date => {
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
        <section className="w-[400px] bg-white dark:bg-gray-900 bg-opacity-95 p-5 lg:p-7 rounded-xl text-black dark:text-gray-200 shadow-lg">
            <div className="flex justify-center space-x-2 items-center">
                    {stockAppData?.icon && <Image src={stockAppData.icon} alt={`${stockAppData.name} logo`} width={30} height={30} />}
                    <p className="text-lg font-medium">{stockAppData?.name}</p>
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
                    {(session?.user?.personalData?.image || session?.user.image) && <Image src={session?.user?.personalData?.image || session?.user.image} alt="User profile" width={90} height={90} className="-[90px] h-[90px] rounded-full mx-auto mt-4" />}
                    <p className="text-gray-700 text-center dark:text-gray-300">@{session?.user.username}</p>
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 mt-5">
                        <tbody>
                            <tr className="dark:bg-gray-800 border-b dark:border-gray-900">
                                <th scope="row" className="px-3 py-4 font-medium text-gray-900 dark:text-gray-300 whitespace-nowrap">
                                ID
                                </th>
                                <td className="px-3 py-4 dark:text-gray-300">
                                {session?.user.id}
                                </td>
                            </tr>
                            <tr className="dark:bg-gray-800 border-b dark:border-gray-900">
                                <th scope="row" className="px-3 py-4 font-medium text-gray-900 dark:text-gray-300 whitespace-nowrap">
                                    Name
                                </th>
                                <td className="px-3 py-4 dark:text-gray-300">
                                    {session?.user.personalData?.firstName} {session?.user.personalData?.lastName}
                                </td>
                            </tr>
                            <tr className="dark:bg-gray-800 border-b dark:border-gray-900">
                                <th scope="row" className="px-3 py-4 font-medium text-gray-900 dark:text-gray-300 whitespace-nowrap">
                                    Date of Birth
                                </th>
                                <td className="px-3 py-4 dark:text-gray-300">
                                    <FormatDate />
                                </td>
                            </tr>
                            <tr className="dark:bg-gray-800 border-b dark:border-gray-900">
                                <th scope="row" className="px-3 py-4 font-medium text-gray-900 dark:text-gray-300 whitespace-nowrap">
                                    Agent
                                </th>
                                <td className="px-3 py-4 dark:text-gray-300">
                                    {userAgent}
                                </td>
                            </tr>
                            <tr className="dark:bg-gray-800 border-b dark:border-gray-900">
                                <th scope="row" className="px-3 py-4 font-medium text-gray-900 dark:text-gray-300 whitespace-nowrap">
                                    Requested by
                                </th>
                                <td className="px-3 py-4 dark:text-gray-300 flex items-center space-x-2">
                                    {requestedAppData?.icon && <Image src={requestedAppData?.icon} width={20} height={20} alt={`${requestedAppData?.name} logo`} />}
                                    <p>{requestedAppData?.name}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="flex space-x-2 items-center mt-8">
                        <button type="button" onClick={() => signOut({ callbackUrl: callbackUrlLink })} className="flex items-center justify-center space-x-2 w-full outline-none py-1.5 bg-red-500 bg-opacity-40 border border-red-500 hover:bg-opacity-100 hover:text-white dark:text-gray-200 transition-all mx-auto rounded-md">
                            <p>Sign Out</p>
                            <IoExitOutline size={20} />
                        </button>
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