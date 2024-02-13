"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import shAuthenticationIcon from "@/assets/icon_sh_auth.webp";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <main className="min-h-screen w-full bg-white dark:bg-black text-black dark:text-gray-200">
            <div className="container h-screen mx-auto flex items-center justify-center p-5 lg:p-0">
                <section className="space-y-6">
                    <div className="flex justify-center space-x-2 items-center">
                        <Image src={shAuthenticationIcon.src} alt="SH authentication logo" width={30} height={30} />
                        <p className="text-lg font-medium">SH authentication system</p>
                    </div>
                    <p className="text-7xl lg:text-9xl text-gray-600 dark:text-gray-400 font-extrabold text-center">{509}</p>
                    <p className="text-center text lg:text-lg text-red-700 font-medium max-w-[600px] mx-auto">Error: Something went wrong!</p>
                    <Link href="/" className="py-1 outline-none bg-blue-500 hover:bg-blue-600 text-white dark:text-gray-200 hover:text-gray-200 dark:hover:text-gray-300 rounded-md block max-w-[400px] text-center mx-auto">
                        <p>Home page</p>
                    </Link>
                </section>
            </div>
        </main>
    );
}
