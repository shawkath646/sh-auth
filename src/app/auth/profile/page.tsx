import type { Metadata } from 'next';
import Link from "next/link";
import { auth } from "@/app/auth";
import { CustomSessionType } from "@/types/types";
import { FaHome, FaUser } from "react-icons/fa";
import { IoIosApps } from "react-icons/io";
import { IoKey, IoExitOutline } from "react-icons/io5";
import { MdOutlineWorkspacePremium, MdSecurity } from "react-icons/md";

export const metadata: Metadata = {
    title: 'Profile',
}

export default async function Page() {

    const session = await auth() as CustomSessionType;

    return (
        <main className="min-h-screen bg-white dark:bg-black text-black dark:text-gray-200">
            <div className="container mx-auto p-5 lg:px-0">
                <h2 className="text-xl lg:text-2xl font-medium">Profile</h2>
                <p className="text-gray-500 text-sm">@{session.user.username}</p>
                <section className="mt-5">
                    <ul className="grid w-full grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
                        <li>
                            <Link href="/auth/profile/general" className="space-y-2 hover:bg-gray-100 transition-all dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-gray-200 rounded-lg p-10 block">
                                <div className="bg-blue-200 text-blue-600 rounded-full p-2 w-max transition-all mx-auto">
                                    <FaUser size={35} />
                                </div>
                                <p className="text-lg text-center">General</p>
                            </Link>
                        </li>
                        <li>
                            <Link href="/auth/profile/enterprise" className="space-y-2 hover:bg-gray-100 transition-all dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-gray-200 rounded-lg p-10 block">
                                <div className="bg-yellow-200 text-yellow-600 rounded-full p-2 w-max transition-all mx-auto">
                                    <MdOutlineWorkspacePremium size={35} />
                                </div>
                                <p className="text-lg text-center">Enterprise</p>
                            </Link>
                        </li>
                        <li>
                            <Link href="/auth/profile/security" className="space-y-2 hover:bg-gray-100 transition-all dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-gray-200 rounded-lg p-10 block">
                                <div className="bg-green-200 text-green-600 rounded-full p-2 w-max transition-all mx-auto">
                                    <IoKey size={35} />
                                </div>
                                <p className="text-lg text-center">Security</p>
                            </Link>
                        </li>
                        <li>
                            <Link href="/auth/profile/address" className="space-y-2 hover:bg-gray-100 transition-all dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-gray-200 rounded-lg p-10 block">
                                <div className="bg-indigo-200 text-indigo-600 rounded-full p-2 w-max transition-all mx-auto">
                                    <FaHome size={35} />
                                </div>
                                <p className="text-lg text-center">Address</p>
                            </Link>
                        </li>
                        <li>
                            <Link href="/auth/profile/permissions" className="space-y-2 hover:bg-gray-100 transition-all dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-gray-200 rounded-lg p-10 block">
                                <div className="bg-teal-200 text-teal-600 rounded-full p-2 w-max transition-all mx-auto">
                                    <MdSecurity size={35} />
                                </div>
                                <p className="text-lg text-center">Permissions</p>
                            </Link>
                        </li>
                        <li>
                            <Link href="/auth/profile/applications" className="space-y-2 hover:bg-gray-100 transition-all dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-gray-200 rounded-lg p-10 block">
                                <div className="bg-fuchsia-200 text-fuchsia-600 rounded-full p-2 w-max transition-all mx-auto">
                                    <IoIosApps size={35} />
                                </div>
                                <p className="text-lg text-center">Applications</p>
                            </Link>
                        </li>
                        <li>
                            <Link href="/auth/profile/logout" className="space-y-2 hover:bg-gray-100 transition-all dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-gray-200 rounded-lg p-10 block">
                                <div className="bg-red-200 text-red-600 rounded-full p-2 w-max transition-all mx-auto">
                                    <IoExitOutline size={35} />
                                </div>
                                <p className="text-lg text-center">Log Out</p>
                            </Link>
                        </li>
                    </ul>
                </section>
            </div>
        </main>
    );
}