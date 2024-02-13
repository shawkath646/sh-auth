"use client";
import { Suspense } from "react";
import { SessionProvider } from "next-auth/react";
import LoadingSpinner from "./LoadingSpinner";

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return (
      <SessionProvider>
        <Suspense fallback={<LoadingSpinner />}>
          {children}
        </Suspense>
      </SessionProvider>
  );
};
