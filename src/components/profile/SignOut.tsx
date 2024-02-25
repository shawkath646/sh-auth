"use client";
import { signOut } from "next-auth/react";

export default function SignOut() {
    return (
        <div>
            <button type="button" onClick={() => signOut({ callbackUrl: "/auth/sign-in" })}>Log out</button>
        </div>
    );
}