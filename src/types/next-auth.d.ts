import { DefaultSession } from "next-auth";
import { CustomSessionType } from "@/types/types";

// nextauth.d.ts
declare module "next-auth" {
    interface Session extends DefaultSession {
        user?: CustomSessionType['user'] | Session['user'];
    }
}
