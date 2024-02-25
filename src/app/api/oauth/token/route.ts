import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    const a = req.body

    console.log(a);

    return NextResponse.json({hi: "Eat muri"}, { status: 200 });
}

export async function GET(req: NextRequest) {

    const a = req.body

    console.log(a);

    return NextResponse.json({hi: "Eat muri"}, { status: 200 });
}