import { Metadata } from "next";
import CallbackBox from "./CallbackBox";

export const metadata: Metadata = {
    title: "Please wait..."
}

export default async function Page() {
    return (
        <CallbackBox />
    );
}

