import { NextAuthOptions } from "next-auth";

// For providing db connection and mutations with prisma
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";
import prisma from "@/utils/db/prisma";

// provider related imports
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { GoogleProfile } from "next-auth/providers/google";

// env with zod for type safety
import { env } from "@/utils/env";

// for hashing password
import bcrypt from "bcrypt";
import { mergeLocalCartWithUserCart } from "@/actions/cartActions";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      profile(profile: GoogleProfile) {
        return {
          id: profile.sub || profile.email,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: profile.role ?? "user",
        };
      },
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: env.EMAIL_FROM,
    }),
    // CredentialsProvider is not recommended by next-ath but added for learning purpose
    // Can't be used with getServerSession without difficult configurations which Im not able to do
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Your email..." },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Your password...",
        },
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

        // return if no user with matching email
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
        return userWithoutPassword;
      },
    }),
  ],
  events: {
    async signIn({ user }) {
      await mergeLocalCartWithUserCart(user.email || "");
    },
  },
  callbacks: {
    async jwt({ token }) {
      // fetch the user by the email on the token
      const fetchedUser = await prisma.user.findFirst({
        where: {
          email: token.email || "",
        },
      });

      // extend the token with fetchedUser.role
      // Token can now be used in the middleware.ts to grand access or deny pages
      token.role = fetchedUser?.role || "";

      return token;
    },
    async session({ session }) {
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
