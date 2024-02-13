import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/database/firebase";

export async function GET(req: NextRequest) {
    try {
        const bucket = storage.bucket();

        const fileName = 'profile_shcloudbstlabs.png';

        await bucket.file(fileName).delete()

        

        return NextResponse.json("success");
    } catch (error) {
        console.error('Error getting download URL:', error);
        return NextResponse.json(error);
    }
}
