import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get("authjs.session-token")?.value;
    if (request.nextUrl.pathname.startsWith("/auth/protected") && !sessionCookie) return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    const requestedAppCookie = request.cookies.get("recieved_response")?.value;
    if (request.nextUrl.pathname === "/auth/protected/user-info" && !requestedAppCookie) return NextResponse.redirect(new URL("/auth/protected/profile", request.url));
    return NextResponse.next();
}
