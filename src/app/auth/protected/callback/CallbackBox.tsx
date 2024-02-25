"use client";
import { useEffect } from "react";
import handleCallback from "@/actions/oAuth/handleCallback";
import { ImSpinner8 } from "react-icons/im";

export default function CallbackBox() {

    useEffect(() => {
        handleCallback();
    }, []);

    return (
        <section className="bg-white dark:bg-gray-900 rounded-lg p-6 text-black dark:text-gray-200 space-y-4">
            <ImSpinner8 size={38} className="mx-auto animate-spin" />
            <p className="text-lg font-medium">Redirecting...</p>
        </section>
    );
}