import { NextAuthConfig } from "next-auth";
import { FirestoreAdapter } from "@/lib/database/firebase-adapter";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import getUserData from "@/lib/database/databaseActions/getUserData";
import saveLoginHistory from "@/lib/database/databaseActions/saveLoginHistory";
import validateUser from "@/lib/database/databaseActions/validateUser";
import { db } from "@/lib/database/firebase";
import { UserDataType } from "@/types/types";

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
      newUser: '/auth/sign-up',
      signOut: '/auth/profile?tab=logout',
      error: '/error'
    },
    callbacks: {
      async session({ session, token }) {
        if (session.user) {
          const { email, phoneNumber, username, dateOfBirth, gender, isEnterpriseUser, permissions, country, oldUser, sub } = token;
          Object.assign(session.user, { 
            id: sub || session.user.id,
            email, gender, phoneNumber, username, dateOfBirth, isEnterpriseUser, permissions, country, oldUser
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
            Object.assign(token, { email: primaryEmail, phoneNumber, username, dateOfBirth, gender, isEnterpriseUser, permissions, country, oldUser: true });
          }
        }
        return token;
      }
    },
    session: {
      strategy: "jwt",
    },
} satisfies NextAuthConfig;