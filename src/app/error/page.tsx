import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import MessageList from "@/JsonData/MessagesList.json";
import shAuthenticationIcon from "@/assets/icon_sh_auth.webp";


interface MessageListType {
    [key: string]: { code: number; message: string };
}

export const metadata: Metadata = {
    title: "Error"
}

export default function Error({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined }}) {
    const errorCode = searchParams.code;
    let resolvedErrorCode;

    if (Array.isArray(errorCode)) resolvedErrorCode = errorCode[0];
    else resolvedErrorCode = errorCode || "";

    const messageObject = (MessageList as MessageListType)[resolvedErrorCode];

    return (
        <main className="min-h-screen w-full bg-white dark:bg-black text-black dark:text-gray-200">
            <div className="container h-screen mx-auto flex items-center justify-center p-5 lg:p-0">
                <section className="space-y-6">
                    <div className="flex justify-center space-x-2 items-center">
                        <Image src={shAuthenticationIcon.src} alt="SH authentication logo" width={30} height={30} />
                        <p className="text-lg font-medium">SH authentication system</p>
                    </div>
                    <p className="text-7xl lg:text-9xl text-gray-600 dark:text-gray-400 font-extrabold text-center">{messageObject ? messageObject.code : 509}</p>
                    <p className="text-center text lg:text-lg text-red-500 dark:text-red-700 font-medium max-w-[600px] mx-auto">Error: {messageObject ? messageObject.message : "Unknown error!"}</p>
                    <Link href="/" className="py-1 outline-none bg-blue-500 hover:bg-blue-600 text-white dark:text-gray-200 hover:text-gray-200 dark:hover:text-gray-300 rounded-md block max-w-[400px] text-center mx-auto">
                        <p>Home page</p>
                    </Link>
                </section>
            </div>
        </main>
    );
}
