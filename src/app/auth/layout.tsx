"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createContext, Suspense, useEffect, useState } from "react";
import LoadingSpinner from "@/components/layout/LoadingSpinner";
import getApplicationBasicData from "@/lib/getApplicationBasicData";
import { ApplicationBasicDataType } from "@/types/types";
import bgBanner from "@/assets/background_signin.jpg";


const ApplicationBasicDataContext = createContext<ApplicationBasicDataType | undefined>(undefined);

export { ApplicationBasicDataContext };

interface ErrorMessageType {
    error: string
}

export default function Layout({ children, }: Readonly<{ children: React.ReactNode; }>) {

    const [isLoading, setLoading] = useState<boolean>(true);
    const [applicationBasicData, setApplicationBasicData] = useState<ApplicationBasicDataType>();

    const router = useRouter();

    useEffect(() => {
        getApplicationBasicData()
        .then(data => {
            const jsonData = JSON.parse(data) as ApplicationBasicDataType | ErrorMessageType;
            if ('error' in jsonData) {
                router.push(`/error?code=${jsonData.error}`);
                return;
            }
            setApplicationBasicData(jsonData);
            setLoading(false);
        })
        .catch(error => {
            console.error("Error fetching application basic data:", error);
        });
    }, []);

    return (
        <ApplicationBasicDataContext.Provider value={applicationBasicData}>
            <main className="min-h-screen w-full bg-cover bg-center relative">
                <Image src={bgBanner.src} alt="Background" fill priority />
                <div className="dark:bg-black dark:bg-opacity-50 relative">
                    <div className="min-h-screen container mx-auto flex items-center justify-center">
                        {isLoading ? (
                            <LoadingSpinner />
                        ) : (
                            <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
                        )}
                    </div>
                </div>

                <footer className="absolute bottom-2 w-full z-30">
                    <p className="text-center text-white dark:text-gray-200 ">{applicationBasicData?.brandData.copyrightText}</p>
                </footer>
            </main>
        </ApplicationBasicDataContext.Provider>
    );
}