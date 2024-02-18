import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import GlobalLayoutWrapper from "@/components/layout/GlobalLayoutWrapper";
import "./globals.css";


const poppins = Poppins({ weight: ['300', '400', '500', '600'], subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "SH Authentication System",
    template: "%s | SH Authentication System"
  },
  description: "Next generation authentication app by SH CloudBurst Labs",
}

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          href="/apple-icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
      </head>
      <body className={poppins.className}>
        <GlobalLayoutWrapper>{children}</GlobalLayoutWrapper>
        <SpeedInsights />
      </body>
    </html>
  );
}
