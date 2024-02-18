"use client";
import { SessionProvider } from "next-auth/react";


export default function GlobalLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
};
