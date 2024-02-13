import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import AppProvider from "@/components/layout/AppProvider";

const poppins = Poppins({ weight: ['300', '400', '500', '600'], subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    absolute: "",
    default: "SH authentication system",
    template: "%s | SH authentication system"
  },
  description: "Next generation authentication app by SH CloudBurst Labs",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
