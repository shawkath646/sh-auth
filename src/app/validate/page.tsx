"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from "react";
import validateData from "@/lib/validateData";
import { ImSpinner8 } from "react-icons/im";

export default function Page() {

    const searchParams = useSearchParams()

    const requestedAppId = searchParams.get("app_id");
    const requestedAppAuthToken = searchParams.get("auth_token");
    const requestedAppCallbackUrl = searchParams.get("callback_url");

    const router = useRouter();

    useEffect(() => {

        if (!requestedAppId || !requestedAppAuthToken || !requestedAppCallbackUrl) return router.push("/error?code=M019");
        
        validateData(requestedAppId, requestedAppAuthToken, requestedAppCallbackUrl)
        .then(response => {
            if (response) return router.push("/auth/sign-in");
            else return router.push("/error?code=M002");
        });

    }, [requestedAppId, requestedAppAuthToken, requestedAppCallbackUrl]);

    return (
        <main className="w-full bg-gradient-to-r from-violet-800 to-blue-800">
            <div className="min-h-screen container mx-auto flex items-center justify-center">
                <section className="bg-white dark:bg-gray-900 rounded-lg p-6 text-black dark:text-gray-200 space-y-4">
                    <ImSpinner8 size={38} className="mx-auto animate-spin" />
                    <p className="text-lg font-medium">Verifying request...</p>
                </section>
            </div>
        </main>
    );
}