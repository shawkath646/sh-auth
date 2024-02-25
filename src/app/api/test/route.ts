import { storage } from "@/config/firebase.config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    const file = storage.bucket().file("icon_linkedin.png");

    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 100);

    const downloadUrl = await file.getSignedUrl({
        action: "read",
        expires: expirationDate
    });

    return NextResponse.json({ downloadUrl });
}