// Doing module augmentation, meaning we extend the interfaces

import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";
import { User } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string | null;
      email: string | null;
      password: string | null;
      emailVerified: Date | null;
      image: string | null;
      role: $Enums.Role;
    } & DefaultSession;
  }

  interface User extends DefaultUser {
    role: string | "";
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: string;
  }
}
