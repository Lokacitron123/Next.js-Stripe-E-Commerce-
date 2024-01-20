import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import prisma from "@/utils/db/prisma";
import { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "@/utils/env";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        //  validation of email and password
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // check for user
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          return null;
        }

        // Check password for match
        const checkPassword = await bcrypt.compare(
          credentials.password,
          user.password || ""
        );

        if (!checkPassword) {
          return null;
        }

        // If valid, return user without password
        const { password, ...userWithoutPassword } = user;
        return { userWithoutPassword, id: user.id };
      },
    }),
  ],
  callbacks: {
    session({ session, user }) {
      // Check if user and user.id are defined before setting session.user.id
      if (user && user.id) {
        session.user.id = user.id;
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
