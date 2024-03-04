import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get(process.env.NODE_ENV === "development" ? "authjs.session-token" : "__Secure-authjs.session-token")?.value;
    if (request.nextUrl.pathname.startsWith("/auth") && !sessionCookie) return NextResponse.redirect(new URL("/sign-in", request.url));
    const requestedAppCookie = request.cookies.get("recieved_response")?.value;
    if (request.nextUrl.pathname === "/auth/user-info" && !requestedAppCookie) return NextResponse.redirect(new URL("/auth/profile", request.url));
    return NextResponse.next();
}
