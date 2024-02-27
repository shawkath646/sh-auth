import { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import getUserData from "@/actions/getData/getUserData";
import saveLoginHistory from "@/actions/database/saveLoginHistory";
import validateUser from "@/actions/database/validateUser";
import { CustomSessionType, UserDataType } from "@/types/types";
import getUser from "@/actions/database/getUser";


export const authConfig = {
    providers: [
      Google,
      Facebook,
      GitHub,
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
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
      signIn: '/auth/sign-in',
      signOut: '/auth/protected/profile?tab=logout',
      error: '/error'
    },
    callbacks: {
      async signIn({ user, credentials }) {
        const userExists = await getUser(user.email || credentials?.username as string);
        if (!userExists) return "/auth/sign-up";
        return true;
      },
      async session({ session, token }): Promise<CustomSessionType> {
        if (session.user) {
          const { email, emailVerified, phoneNumber, username, firstName, lastName, dateOfBirth, gender, isEnterpriseUser, permissions, country, sub } = token;
          Object.assign(session.user, { 
            id: sub || session.user.id,
            email, emailVerified, gender, phoneNumber, username, firstName, lastName, dateOfBirth, isEnterpriseUser, permissions, country
          });
          if (session.user.id) await saveLoginHistory(session.user.id);
        }
        return session;
      },
      async jwt({ token }) {
        if (token.email) {
          const userData = await getUserData(token.email) as UserDataType;
          if (userData) {
            const { permissions, username, isEnterpriseUser, contactInfo, personalData } = userData;
            const primaryEmail = contactInfo.email.find(e => e.type === "primary")?.address;
            const emailVerified = contactInfo.email.find(e => e.type === "primary")?.verified;
            const firstName = personalData.firstName;
            const lastName = personalData.lastName;
            const phoneNumber = contactInfo.phoneNumber[0];
            const { dateOfBirth, gender } = personalData;
            const country = personalData.address.permanent.country;
            Object.assign(token, { email: primaryEmail, emailVerified, phoneNumber, username, firstName, lastName, dateOfBirth, gender, isEnterpriseUser, permissions, country });
          }
        }
        return token;
      }
    },
    session: {
      strategy: "jwt",
    },
} satisfies NextAuthConfig;