import { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import getUser from "@/actions/database/getUser";
import validateUser from "@/actions/database/validateUser";
import saveLoginHistory from "@/actions/database/saveLoginHistory";
import { CustomSessionType, UserDataType } from "@/types/types";

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
      signIn: '/sign-in',
      signOut: '/auth/profile/logout',
      error: '/error'
    },
    callbacks: {
      async signIn({ user, credentials }) {
        const userExists = await getUser(user.email || credentials?.username as string);
        if (!userExists) return "/sign-up";
        return true;
      },
      async session({ session, token }): Promise<CustomSessionType> {
        if (session.user) {
          const { id, email, emailVerified, phoneNumber, username, firstName, lastName, dateOfBirth, gender, isEnterpriseUser, permissions, country } = token;
          Object.assign(session.user, { 
            id, email, emailVerified, gender, phoneNumber, username, firstName, lastName, dateOfBirth, isEnterpriseUser, permissions, country
          });
          if (session.user.id) await saveLoginHistory(session.user.id);
        }
        return session;
      },
      async jwt({ token }) {
        if (token.email) {
          const userData = await getUser(token.email) as UserDataType;
          if (userData) {
            const { permissions, username, isEnterpriseUser, contactInfo, personalData, id } = userData;
            const primaryEmail = contactInfo.email.find(e => e.type === "primary")?.address;
            const emailVerified = contactInfo.email.find(e => e.type === "primary")?.verified;
            const firstName = personalData.firstName;
            const lastName = personalData.lastName;
            const phoneNumber = contactInfo.phoneNumber[0];
            const { dateOfBirth, gender } = personalData;
            const country = personalData.address.permanent.country;
            Object.assign(token, { id, email: primaryEmail, emailVerified, phoneNumber, username, firstName, lastName, dateOfBirth, gender, isEnterpriseUser, permissions, country });
          }
        }
        return token;
      }
    },
    session: {
      strategy: "jwt",
    },
} satisfies NextAuthConfig;