"use client";
import userSignOut from "@/actions/otherActions/userSignOut";

export default function LogoutButton() {
    return (
        <button onClick={() => userSignOut()} className="bg-red-500 hover:bg-red-600 text-white dark:text-gray-200 font-bold py-1.5 px-4 rounded transition-all">Log Out</button>
    );
}