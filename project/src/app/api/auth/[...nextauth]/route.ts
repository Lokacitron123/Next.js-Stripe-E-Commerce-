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
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          place: "Your username",
        },
        password: {
          label: "Password",
          type: "password",
        },
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        //  validation of email and password
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // check for user
        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email,
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
        console.log("trying to log in");
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      },
    }),
  ],
  secret: env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
