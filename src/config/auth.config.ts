import { cookies } from "next/headers";
import { NextAuthConfig } from "next-auth";
import { FirestoreAdapter } from "@/lib/firebase-adapter";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import getUserData from "@/actions/getData/getUserData";
import saveLoginHistory from "@/actions/database/saveLoginHistory";
import validateUser from "@/actions/database/validateUser";
import { db } from "@/config/firebase.config";
import { CustomSessionType, UserDataType } from "@/types/types";
import getUser from "@/actions/database/getUser";


export const authConfig = {
    providers: [
      Google({
        allowDangerousEmailAccountLinking: true
      }),
      Facebook({
        allowDangerousEmailAccountLinking: true
      }),
      GitHub({
        allowDangerousEmailAccountLinking: true
      }),
      Credentials({
        name: "Credentials",
        credentials: {},
        async authorize(credentials, _req) {
          const { username, password } = credentials as {
            username: string;
            password: string;
          };
          return await validateUser({ username, password });
        }
      }),
    ],
    adapter: FirestoreAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
      signIn: '/auth/sign-in',
      signOut: '/auth/protected/profile?tab=logout',
      error: '/error'
    },
    callbacks: {
      async signIn({ user, account, profile, email, credentials }) {
        const userExists = await getUser(user.email || credentials?.username as string);
        if (!userExists) return "/auth/sign-up";
        return true;
      },
      async redirect() {
        const cookieList = cookies();
        const requestedAppCookie = cookieList.get("recieved_response")?.value;
        if (requestedAppCookie) return "/auth/protected/user-info";
        else return"/auth/protected/profile";
      },
      async session({ session, token }): Promise<CustomSessionType> {
        if (session.user) {
          const { email, phoneNumber, username, dateOfBirth, gender, isEnterpriseUser, permissions, country, sub } = token;
          Object.assign(session.user, { 
            id: sub || session.user.id,
            email, gender, phoneNumber, username, dateOfBirth, isEnterpriseUser, permissions, country
          });
          await saveLoginHistory(session.user.id);
        }
        return session;
      },
      async jwt({ token }) {
        if (token.email) {
          const userData = await getUserData(token.email) as UserDataType;
          if (userData) {
            const { permissions, username, isEnterpriseUser, contactInfo, personalData } = userData;
            const primaryEmail = contactInfo.email.find(e => e.type === "primary");
            const phoneNumber = contactInfo.phoneNumber[0];
            const { dateOfBirth, gender } = personalData;
            const country = personalData.address.permanent.country;
            Object.assign(token, { email: primaryEmail, phoneNumber, username, dateOfBirth, gender, isEnterpriseUser, permissions, country });
          }
        }
        return token;
      }
    },
    session: {
      strategy: "jwt",
    },
} satisfies NextAuthConfig;