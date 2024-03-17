import type { Metadata } from 'next';
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/app/auth";
import getAllApps from "@/actions/database/profile/getAllApps";
import formatDate from "@/utils/formatDate";
import toTitleCase from "@/utils/toTitleCase";
import { CustomSessionType } from "@/types/types";
import { BiError } from "react-icons/bi";
import { IoIosArrowBack } from "react-icons/io";

export const metadata: Metadata = {
    title: 'Applications',
}

export default async function Page() {

    const session = await auth() as CustomSessionType;
    const allAppsData = await getAllApps(session.user.id);

    return (
        <main className="min-h-screen bg-white dark:bg-black text-black dark:text-gray-200">
            <div className="container mx-auto p-5 lg:px-0">
                <div className="flex items-center space-x-4">
                    <Link href="/auth/profile">
                        <IoIosArrowBack size={20} />
                    </Link>
                    <h2 className="text-lg md:text-xl lg:text-2xl font-thin">Applications</h2>
                </div>
                {session.user.emailVerified && (
                    <div className="w-full mt-4 text-right">
                        <Link href="/auth/profile/applications/create-new" className="px-1.5 lg:px-3 py-1 lg:py-1.5 text-sm lg:text-base bg-blue-600 text-white dark:text-gray-200 rounded hover:bg-blue-700 transition-all">Create new</Link>
                    </div>
                )}

                {allAppsData.length === 0 ? (
                    <section className="flex items-center space-x-2 justify-center mt-20">
                        <BiError size={25} />
                        <p className="text-lg lg:text-xl">No applications found. Begin now by creating your first one.</p>
                    </section>
                ) : (
                    <section className="grid w-full grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4 mt-4">
                        {allAppsData.map((data, index) => (
                            <Link href={`/auth/profile/applications/manage/${data.id}`} key={index} className="border border-gray-300 dark:border-gray-500 rounded-lg w-auto md:w-[400px] py-3 px-3 lg:px-5 mx-auto hover:scale-95 transition-all">
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center space-x-2">
                                        {data.appIcon && <Image src={data.appIcon} height={20} width={20} alt={`${data.appName} icon`} className="h-[20px] w-[20px]" />}
                                        <p className="lg:text-lg font-medium truncate">{data.appName}</p>
                                    </div>
                                    <p className={`py-0.5 px-1 ${data.status === "active" ? "bg-green-600 text-green-600" : ""} ${data.status === "inactive" ? "bg-amber-600 text-amber-600" : ""} ${data.status === "suspended" ? "bg-red-600 text-red-600" : ""} bg-opacity-20 rounded text-xs lg:text-sm font-semibold`}>{toTitleCase(data.status)}</p>
                                </div>
                                <table className="border-collapse w-full text-xs lg:text-sm">
                                    <tbody>
                                        <tr>
                                            <th className="py-1 text-left font-medium">App ID</th>
                                            <td className="px-2">:</td>
                                            <td className="py-1">
                                                <div className="text-gray-700 dark:text-gray-300 truncate max-w-[200px]">{data.id}</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="py-1 text-left font-medium">App Type</th>
                                            <td className="px-2">:</td>
                                            <td className="py-1 text-gray-700 dark:text-gray-300">{toTitleCase(data.appType)}</td>
                                        </tr>
                                        <tr>
                                            <th className="py-1 text-left font-medium w-[90px]">Created on</th>
                                            <td className="px-2">:</td>
                                            <td className="py-1 text-gray-700 dark:text-gray-300">{formatDate(data.createdOn as Date)}</td>
                                        </tr>
                                        <tr>
                                            <th className="py-1 text-left font-medium">Homepage</th>
                                            <td className="px-2">:</td>
                                            <td className="py-1 max-w-[200px]">
                                                <div className="truncate">
                                                    <Link href={data.website} className="text-blue-500 hover:text-blue-600 transition-all">
                                                        {data.website}
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Link>
                        ))}
                    </section>
                )}
            </div>
        </main>
    );
}