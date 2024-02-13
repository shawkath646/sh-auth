import { DefaultSession } from "next-auth";
import { CustomSessionType } from "@/types/gettedUserDataType";

// nextauth.d.ts
declare module "next-auth" {
    interface Session extends DefaultSession {
        user?: CustomSessionType['user'] | Session['user'];
    }
}
