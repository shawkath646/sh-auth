import type { Metadata } from 'next';
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import LogoutButton from "./LogoutButton";

export const metadata: Metadata = {
    title: 'Logout',
}

export default function Page() {

    return (
        <main className="min-h-screen bg-white dark:bg-black text-black dark:text-gray-200">
            <div className="container mx-auto p-5 lg:px-0">
                <div className="flex items-center space-x-4">
                    <Link href="/auth/profile">
                        <IoIosArrowBack size={20} />
                    </Link>
                    <h2 className="text-xl lg:text-2xl font-thin">Log out</h2>
                </div>
                <div className="flex flex-col items-center justify-center h-[600px]">
                    <h1 className="text-3xl font-bold mb-4">Goodbye!</h1>
                    <p className="text-lg mb-6 text-center">Thank you for using our application.</p>
                    <LogoutButton />
                </div>
            </div>

        </main>
    );
}