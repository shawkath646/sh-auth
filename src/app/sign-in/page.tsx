import type { Metadata } from 'next';
import Image from "next/image";
import bgBanner from "@/assets/background_signin.jpg";
import getAppData from "@/actions/database/getAppData";
import getBrandData from "@/actions/database/getBrandData";
import SignInBox from "./SignInBox";

export const metadata: Metadata = {
    title: 'Sign in',
}

export default async function Page() {

    const stockAppId = process.env.STOCK_APP_ID;
    const stockAppData = await getAppData(stockAppId as string);
    const brandData = await getBrandData();

    return (
        <main className="min-h-screen w-full relative">
            <Image src={bgBanner.src} alt="Background" className="object-cover object-center" fill priority />
            <div className="dark:bg-black dark:bg-opacity-50 relative">
                <div className="min-h-screen container mx-auto flex items-center justify-center">
                    <section className="w-[400px] lg:w-[450px] bg-white dark:bg-gray-900 bg-opacity-95 dark:bg-opacity-95 p-8 lg:p-7 rounded-xl text-black dark:text-gray-200 shadow-lg">
                        <div className="flex justify-center space-x-2 items-center mb-10">
                            {stockAppData?.appIcon && <Image src={stockAppData.appIcon} alt={`${stockAppData.appName} logo`} width={30} height={30} />}
                            <p className="text-lg font-medium">{stockAppData?.appName}</p>
                        </div>
                        <SignInBox />
                    </section>
                </div>
            </div>

            <footer className="absolute bottom-2 w-full z-30">
                <p className="text-center text-white dark:text-gray-200 ">{brandData.copyrightText}</p>
            </footer>
        </main>
    );

}
