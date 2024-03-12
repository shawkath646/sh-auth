import { headers } from "next/headers";
import { cache } from "react";

const getUserAgentData = cache(async() => {
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

    return `${osString} (${browserString})`;
})

export default getUserAgentData;