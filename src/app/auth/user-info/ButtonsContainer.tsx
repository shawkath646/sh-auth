"use client";
import { useState } from "react";
import prepareOAuthRedirect from "@/actions/database/oAuth/prepareOAuthRedirect";
import userSignOut from "@/actions/otherActions/userSignOut";
import { CgSpinner } from "react-icons/cg";
import { IoIosArrowForward } from "react-icons/io";

export default function ButtonsContainer() {

    const [isLoading, setLoading] = useState(false);

    const handleContinue = async () => {
        setLoading(true);
        await prepareOAuthRedirect();
    }

    return (
        <div className="flex space-x-2 items-center mt-8">
            <button type="button" onClick={() => userSignOut()} className="flex items-center justify-center space-x-2 w-full outline-none py-1.5 bg-red-500 bg-opacity-40 border border-red-500 hover:bg-opacity-100 hover:text-white dark:text-gray-200 transition-all mx-auto rounded-md">
                <p>Log out</p>
                <IoIosArrowForward size={20} />
            </button>
            <button type="button" disabled={isLoading} onClick={handleContinue} className="flex items-center justify-center space-x-2 w-full outline-none py-1.5 disabled:bg-gray-500 bg-blue-500 bg-opacity-40 border border-blue-500 hover:bg-opacity-100 hover:text-white dark:text-gray-200 transition-all mx-auto rounded-md">
                {isLoading && <CgSpinner size={20} className="animate-spin" />}
                <p>{isLoading ? "Redirecting..." : "Continue"}</p>
                {!isLoading && <IoIosArrowForward size={20} />}
            </button>
        </div>
    );
}