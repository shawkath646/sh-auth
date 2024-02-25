"use client";
import Head from 'next/head';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from "react";
import validateOAuthData from "@/actions/oAuth/validateOAuthData";
import { ImSpinner8 } from "react-icons/im";


export default function Page() {

    const searchParams = useSearchParams();

    const requestedClientId = searchParams.get("client_id");
    const requestedRedirectUri = searchParams.get("redirect_uri");
    const requestedCodeChallenge = searchParams.get("code_challenge");
    const requestedCodeChallengeMethod = searchParams.get("code_challenge_method");
    const requestedScope = searchParams.get("scope");
    const requestedResponseType = searchParams.get("response_type");

    const router = useRouter();

    useEffect(() => {
        if (!requestedClientId || !requestedRedirectUri || !requestedCodeChallenge || !requestedCodeChallengeMethod || !requestedScope || !requestedResponseType) return router.push("/error?code=M019");
        validateOAuthData({ requestedClientId, requestedRedirectUri, requestedCodeChallenge, requestedCodeChallengeMethod, requestedScope, requestedResponseType })
            .then(_ => router.push("/auth/user-info"));
    }, [searchParams]);

    return (
        <>
            <Head>
                <title>Verifying request...</title>
            </Head>
            <main className="w-full bg-gradient-to-r from-violet-800 to-blue-800">
                <div className="min-h-screen container mx-auto flex items-center justify-center">
                    <section className="bg-white dark:bg-gray-900 rounded-lg p-6 text-black dark:text-gray-200 space-y-4">
                        <ImSpinner8 size={38} className="mx-auto animate-spin" />
                        <p className="text-lg font-medium">Verifying request...</p>
                    </section>
                </div>
            </main>
        </>
    );
}