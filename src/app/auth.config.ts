import { NextAuthConfig } from "next-auth";
import { FirestoreAdapter } from "@/lib/database/firebase-adapter";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { getUserData, saveLoginHistory, validateUser }from "@/lib/database/userManager";
import GettedUserData from "@/types/gettedUserDataType";
import { db } from "@/lib/database/firebase";

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
          const { user } = await validateUser({ username, password });
          return user;
        }
      }),
    ],
    adapter: FirestoreAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
      signIn: '/auth/sign-in',
      newUser: '/auth/sign-up',
      signOut: '/auth/sign-out',
      error: '/error'
    },
    callbacks: {
        async session({ session, token }) {
          if (session.user) {
            const { email, personalData, contactInfo, loginInfo, permissions, username, newUser } = token;
            session.user.id = token.sub || session.user.id;
            session.user.personalData = personalData;
            session.user.contactInfo = contactInfo;
            session.user.loginInfo = loginInfo;
            session.user.permissions = permissions;
            session.user.username = username;
            session.user.newUser = newUser;
            await saveLoginHistory(session.user.id);
          }
          return session;
        },
        async jwt({ token }) {
          if (token.email) {
            const gettedUserData = await getUserData(token.email);
            if (gettedUserData) {
              const { personalData, contactInfo, loginInfo, permissions, username } = gettedUserData as GettedUserData;
              Object.assign(token, { personalData, contactInfo, loginInfo, permissions, username, newUser: false });
            } else {
              token.newUser = true;
            }
          } else {
            token.newUser = true;
          }
          return token;
        }        
      },
      
    session: {
      strategy: "jwt",
    },
} satisfies NextAuthConfig;