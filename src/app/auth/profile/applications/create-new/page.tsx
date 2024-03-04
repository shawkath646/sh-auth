import type { Metadata } from 'next';
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import CreateNewBox from "./CreateNewBox";
 
export const metadata: Metadata = {
  title: 'Register new application',
}


export default async function Page() {

    return (
        <main className="min-h-screen bg-white dark:bg-black text-black dark:text-gray-200">
            <div className="container mx-auto p-3 xl:px-0">
                <div className="flex items-center space-x-4">
                    <Link href="/auth/profile/applications">
                        <IoIosArrowBack size={24} />
                    </Link>
                    <h2 className="text-xl lg:text-2xl font-thin">Register new application</h2>
                </div>
                <CreateNewBox />
            </div>
        </main>
    );
}