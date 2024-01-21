import { DefaultSession } from "next-auth";

// extending the session user object with ID because it is be default not giving to us
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
