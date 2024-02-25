"use client";
import Image from "next/image";
import { createContext, useEffect, useState, Suspense } from "react";
import getAppBasicData from "@/actions/getData/getAppBasicData";
import LoadingSpinner from "@/components/layout/LoadingSpinner";
import { AppBasicDataType } from "@/types/types";
import bgBanner from "@/assets/background_signin.jpg";

const AppBasicDataContext = createContext<AppBasicDataType | undefined>(undefined);
export { AppBasicDataContext };

export default function Layout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    const [isLoading, setLoading] = useState<boolean>(true);
    const [appBasicData, setAppBasicData] = useState<AppBasicDataType>();

    useEffect(() => {
        getAppBasicData()
            .then(data => {
                setAppBasicData(data);
                setLoading(false);
            });
    }, []);

    return (
        <AppBasicDataContext.Provider value={appBasicData}>
            {isLoading ? (
                <main className="min-h-screen w-full bg-cover bg-center relative">
                    <Image src={bgBanner.src} alt="Background" fill priority />
                    <div className="dark:bg-black dark:bg-opacity-50 relative">
                        <div className="min-h-screen container mx-auto flex items-center justify-center">
                            <LoadingSpinner />
                        </div>
                    </div>

                    <footer className="absolute bottom-2 w-full z-30">
                        <p className="text-center text-white dark:text-gray-200 ">{appBasicData?.brandData.copyrightText}</p>
                    </footer>
                </main>
            ) : (
                <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
            )}
        </AppBasicDataContext.Provider>
    );
}