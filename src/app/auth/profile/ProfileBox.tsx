"use client";
import { Session } from "next-auth";
import { useState } from "react";
import { FaHome, FaUser } from "react-icons/fa";
import { IoKey } from "react-icons/io5";
import { MdOutlineWorkspacePremium } from "react-icons/md";

export default function ProfileBox({ session }: { session: Session }) {

    const [currentTab, setCurrentTab] = useState("enterprise");

    return (
        <div className="h-[700px] bg-white text-black dark:bg-black dark:text-gray-200 w-[800px] rounded flex p-4">
            <aside className="text-black p-3 rounded w-[200px]">
                <div className="mb-5">
                    <p className="font-medium text-lg dark:text-gray-200 ">Profile</p>
                    <p className="text-gray-500 text-sm">@{session?.user.username}</p>
                </div>
                <ul className="">
                    <li><button type="button" onClick={() => setCurrentTab("general")} className="py-4 px-4 flex items-center space-x-2 bg-white text-black hover:bg-gray-100 transition-all dark:bg-black dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-gray-200 w-full rounded-lg">
                        <div className={`${currentTab === "general" ? "bg-blue-200 text-blue-600 " : " bg-slate-200 text-slate-600"} rounded-full p-2 transition-all`}>
                            <FaUser size={16} />
                        </div>
                        <p className={currentTab === "general" ? "font-medium" : ""}>General</p>
                    </button></li>
                    <li><button type="button" onClick={() => setCurrentTab("enterprise")} className="py-4 px-4 flex items-center space-x-2 bg-white text-black hover:bg-gray-100 transition-all dark:bg-black dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-gray-200 w-full rounded-lg">
                        <div className={`${currentTab === "enterprise" ? "bg-yellow-200 text-yellow-600 " : " bg-slate-200 text-slate-600"} rounded-full p-2 transition-all`}>
                            <MdOutlineWorkspacePremium size={16} />
                        </div>
                        <p className={currentTab === "enterprise" ? "font-medium" : ""}>Enterprise</p>
                    </button></li>
                    <li><button type="button" onClick={() => setCurrentTab("security")} className="py-4 px-4 flex items-center space-x-2 bg-white text-black hover:bg-gray-100 transition-all dark:bg-black dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-gray-200 w-full rounded-lg">
                        <div className={`${currentTab === "security" ? "bg-green-200 text-green-600 " : " bg-slate-200 text-slate-600"} rounded-full p-2 transition-all`}>
                            <IoKey size={16} />
                        </div>
                        <p className={currentTab === "security" ? "font-medium" : ""}>Security</p>
                    </button></li>
                    <li><button type="button" onClick={() => setCurrentTab("address")} className="py-4 px-4 flex items-center space-x-2 bg-white text-black hover:bg-gray-100 transition-all dark:bg-black dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-gray-200 w-full rounded-lg">
                        <div className={`${currentTab === "address" ? "bg-indigo-200 text-indigo-600 " : " bg-slate-200 text-slate-600"} rounded-full p-2 transition-all`}>
                            <FaHome size={16} />
                        </div>
                        <p className={currentTab === "address" ? "font-medium" : ""}>Address</p>
                    </button></li>
                    <li><button type="button" onClick={() => setCurrentTab("permissions")} className="py-4 px-4 flex items-center space-x-2 bg-white text-black hover:bg-gray-100 transition-all dark:bg-black dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-gray-200 w-full rounded-lg">
                        <div className={`${currentTab === "permissions" ? "bg-teal-200 text-teal-600 " : " bg-slate-200 text-slate-600"} rounded-full p-2 transition-all`}>
                            <FaUser size={16} />
                        </div>
                        <p className={currentTab === "permissions" ? "font-medium" : ""}>Permissions</p>
                    </button></li>
                    <li><button type="button" onClick={() => setCurrentTab("logout")} className="py-4 px-4 flex items-center space-x-2 bg-white text-black hover:bg-gray-100 transition-all dark:bg-black dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-gray-200 w-full rounded-lg">
                        <div className={`${currentTab === "logout" ? "bg-pink-200 text-pink-600 " : " bg-slate-200 text-slate-600"} rounded-full p-2 transition-all`}>
                            <FaUser size={16} />
                        </div>
                        <p className={currentTab === "logout" ? "font-medium" : ""}>Log Out</p>
                    </button></li>
                </ul>
            </aside>
            <div className="h-full"></div>
        </div>
    );
}