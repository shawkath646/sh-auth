import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/app/auth";
import UserInfoBox from "@/app/auth/user-info/UserInfoBox";


export const metadata: Metadata = {
    title: "User info"
}

export default async function Page() {

    const session = await auth();

    if (!session) return redirect("/auth/sign-in");

    const headersList = headers();

    const userAgent = headersList.get("user-agent") || "Unknown";

    const browserRegex = /(chrome|firefox|safari|opera|edge|msie|trident(?=\/))\/?\s*(\d+)/i;
    const browserMatches = userAgent.match(browserRegex);

    let browserString = '';
    if (browserMatches && browserMatches.length >= 3) {
        browserString = `${browserMatches[1]} ${browserMatches[2]}`;
    }

    const osRegex = /\((.*?)\)/;
    const osMatches = userAgent.match(osRegex);

    let osString = '';
    if (osMatches && osMatches.length >= 2) {
        osString = osMatches[1];
    }

    const userAgentString = `${osString} (${browserString})`;

    return (
        <UserInfoBox session={session} userAgent={userAgentString} />
    );
}