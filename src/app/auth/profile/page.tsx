import { Metadata } from "next";
import Link from "next/link";
import { Session } from "next-auth";
import { auth } from "@/app/auth";
import { FaHome, FaUser } from "react-icons/fa";
import { IoKey, IoExitOutline } from "react-icons/io5";
import { MdOutlineWorkspacePremium, MdSecurity } from "react-icons/md";

export const metadata: Metadata = {
    title: "Profile"
}


export default async function Page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined }}) {

    const currentTab = searchParams.currentTab || "general";

    const session = await auth() as Session;


    return (
        <div className="h-[700px] bg-white text-black dark:bg-black dark:text-gray-200 w-[800px] rounded flex p-4">
            <aside className="text-black p-3 rounded w-[200px]">
                <div className="mb-5">
                    <p className="font-medium text-lg dark:text-gray-200 ">Profile</p>
                    <p className="text-gray-500 text-sm">@{session?.user.username}</p>
                </div>
                <ul>
                    <li><Link href="?currentTab=general" className="py-4 px-4 flex items-center space-x-2 bg-white text-black hover:bg-gray-100 transition-all dark:bg-black dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-gray-200 w-full rounded-lg">
                        <div className={`${currentTab === "general" ? "bg-blue-200 text-blue-600 " : " bg-slate-200 text-slate-600"} rounded-full p-2 transition-all`}>
                            <FaUser size={16} />
                        </div>
                        <p className={currentTab === "general" ? "font-medium" : ""}>General</p>
                    </Link></li>
                    <li><Link href="?currentTab=enterprise" className="py-4 px-4 flex items-center space-x-2 bg-white text-black hover:bg-gray-100 transition-all dark:bg-black dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-gray-200 w-full rounded-lg">
                        <div className={`${currentTab === "enterprise" ? "bg-yellow-200 text-yellow-600 " : " bg-slate-200 text-slate-600"} rounded-full p-2 transition-all`}>
                            <MdOutlineWorkspacePremium size={16} />
                        </div>
                        <p className={currentTab === "enterprise" ? "font-medium" : ""}>Enterprise</p>
                    </Link></li>
                    <li><Link href="?currentTab=security" className="py-4 px-4 flex items-center space-x-2 bg-white text-black hover:bg-gray-100 transition-all dark:bg-black dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-gray-200 w-full rounded-lg">
                        <div className={`${currentTab === "security" ? "bg-green-200 text-green-600 " : " bg-slate-200 text-slate-600"} rounded-full p-2 transition-all`}>
                            <IoKey size={16} />
                        </div>
                        <p className={currentTab === "security" ? "font-medium" : ""}>Security</p>
                    </Link></li>
                    <li><Link href="?currentTab=address" className="py-4 px-4 flex items-center space-x-2 bg-white text-black hover:bg-gray-100 transition-all dark:bg-black dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-gray-200 w-full rounded-lg">
                        <div className={`${currentTab === "address" ? "bg-indigo-200 text-indigo-600 " : " bg-slate-200 text-slate-600"} rounded-full p-2 transition-all`}>
                            <FaHome size={16} />
                        </div>
                        <p className={currentTab === "address" ? "font-medium" : ""}>Address</p>
                    </Link></li>
                    <li><Link href="?currentTab=permissions" className="py-4 px-4 flex items-center space-x-2 bg-white text-black hover:bg-gray-100 transition-all dark:bg-black dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-gray-200 w-full rounded-lg">
                        <div className={`${currentTab === "permissions" ? "bg-teal-200 text-teal-600 " : " bg-slate-200 text-slate-600"} rounded-full p-2 transition-all`}>
                            <MdSecurity size={16} />
                        </div>
                        <p className={currentTab === "permissions" ? "font-medium" : ""}>Permissions</p>
                    </Link></li>
                    <li><Link href="?currentTab=logout" className="py-4 px-4 flex items-center space-x-2 bg-white text-black hover:bg-gray-100 transition-all dark:bg-black dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-gray-200 w-full rounded-lg">
                        <div className={`${currentTab === "logout" ? "bg-pink-200 text-pink-600 " : " bg-slate-200 text-slate-600"} rounded-full p-2 transition-all`}>
                            <IoExitOutline size={16} />
                        </div>
                        <p className={currentTab === "logout" ? "font-medium" : ""}>Log Out</p>
                    </Link></li>
                </ul>
            </aside>
            <div className="h-full"></div>
        </div>
    );
    
}