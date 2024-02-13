import { headers } from "next/headers";
import { redirect } from "next/navigation";
import UserInfoBox from "@/components/user-info/UserInfoBox";
import pageValidation from "@/lib/pageValidation";
import { PagePropsType } from "@/types/gettedUserDataType";


export default async function Page(props : PagePropsType) {

    const { stockAppData, requestedAppData, callbackUrl, serverSession } = await pageValidation(props);

    if (!serverSession || serverSession.user.newUser) redirect(`/auth/sign-in?${callbackUrl}`);

    const headersList = headers();

    const userAgent = headersList.get("user-agent") || "";

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
        <main  className="min-h-screen w-full bg-cover bg-center bg-white dark:bg-black relative">
            <div className="min-h-screen container mx-auto flex items-center justify-center h-[95%]">
                <UserInfoBox
                    stockAppData={{ name: stockAppData.data.app_name, icon: stockAppData.data.image }}
                    requestedAppData={{ name: requestedAppData.data.app_name, icon: requestedAppData.data.image }}
                    callbackUrl={callbackUrl}
                    userAgent={userAgentString}
                />
            </div>

            <footer className="absolute bottom-2 w-full z-30">
                <p className="text-center text-gray-800 dark:text-gray-400">{stockAppData.data?.bottomBranding}</p>
            </footer>
        </main>
    );
}