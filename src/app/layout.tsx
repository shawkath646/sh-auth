import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SHAS from "shas-app-controller";
import GlobalLayoutWrapper from "@/components/layout/GlobalLayoutWrapper";
import "./globals.css";


const poppins = Poppins({ weight: ['300', '400', '500', '600'], subsets: ["latin"] });

export const metadata: Metadata = {
  applicationName: "SH Authentication System",
  authors: [
    {
      name: "Shawkat Hossain Maruf",
      url: "https://sh-portfolio-maker.vercel.app/p/shawkath646"
    }
  ],
  title: {
    default: "SH Authentication System",
    template: "%s | SH Authentication System"
  },
  description: "Manage your CloudBurst ID effortlessly to access all products and applications with a single, secure account. Register your web, mobile (Android, iOS), or desktop applications seamlessly for secure remote control. Obtain credentials (App ID, Secret) for OAuth 2.0 access with OpenID Connect.",
  category: "website",
  icons: ["/favicon.ico"],
  publisher: "CloudBurst Lab",
  creator: "Shawkat Hossain Maruf",
  keywords: ["Next.js 14", "OAuth 2.0", "authentication", "providers", "sign in", "sign up", "create new account", "delete account", "register application", "client ID", "client secret", "simple website", "responsive website", "full stack website", "app information", "web application", "remote access", "OpenID client", "Cloudburst Lab", "sh authentication system"],
  metadataBase: new URL('https://sh-authentication-system.vercel.app'),
  openGraph: {
    images: '/opengraph-image.png',
  },
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {

  const { ContentWrapper } = await SHAS({
    cache: "no-cache"
  });

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
        <ContentWrapper>
          <GlobalLayoutWrapper>{children}</GlobalLayoutWrapper>
        </ContentWrapper>
        <SpeedInsights />
      </body>
    </html>
  );
}
