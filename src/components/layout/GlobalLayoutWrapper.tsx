"use client";
import Image from "next/image";
import { Suspense } from "react";
import { SessionProvider } from "next-auth/react";
import LoadingSpinner from "./LoadingSpinner";
import bgBanner from "@/assets/background_signin.jpg";

export default function GlobalLayoutWrapper({ children }: { children: React.ReactNode }) {

  const FallbackPage = () => (
    <main className="min-h-screen w-full relative">
      <Image src={bgBanner.src} alt="Background" className="object-cover object-center" fill priority />
      <div className="dark:bg-black dark:bg-opacity-50 relative">
        <div className="min-h-screen container mx-auto flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    </main>
  );

  return (
    <SessionProvider>
      <Suspense fallback={<FallbackPage />}>
        {children}
      </Suspense>
    </SessionProvider>
  );
};
