import type { Metadata } from 'next';
import Image from "next/image";
import SignUpBox from "./SignUpBox";
import getAppData from "@/actions/database/getAppData";
import getBrandData from "@/actions/database/getBrandData";
import bgBanner from "@/assets/background_signin.jpg";

export const metadata: Metadata = {
    title: 'Sign up',
}

export default async function Page() {
    
    const stockAppId = process.env.STOCK_APP_ID;
    const stockAppData = await getAppData(stockAppId as string);
    const brandData = await getBrandData();

    return (
        <main className="min-h-screen w-full relative">
            <Image src={bgBanner.src} alt="Background" fill className="object-cover object-center" priority />
            <div className="dark:bg-black dark:bg-opacity-50 relative">
                <div className="min-h-screen container mx-auto flex items-center justify-center">
                    <SignUpBox stockAppIcon={stockAppData.appIcon} stockAppName={stockAppData.appName} />
                </div>
            </div>

            <footer className="absolute bottom-2 w-full z-30">
                <p className="text-center text-white dark:text-gray-200 ">{brandData.copyrightText}</p>
            </footer>
        </main>
    );
}