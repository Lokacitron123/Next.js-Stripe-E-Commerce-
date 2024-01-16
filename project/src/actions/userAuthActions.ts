import prisma from "@/utils/db/prisma";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";

type UserProps = {
  username: string;
  email: string;
  password: string;
};

export const registerUser = async (user: UserProps) => {
  const existingUsernameAndOrEmail = await prisma.user.findFirst({
    where: {
      username: user.username,
      email: user.email,
    },
  });

  if (existingUsernameAndOrEmail) {
    throw Error("Username and or email already exists");
  }

  if (user.password === undefined) {
    throw new Error("Password is undefined");
  }

  const hashedPassword = await bcrypt.hash(user.password, 10);

  await prisma.user.create({
    data: {
      username: user.username,
      email: user.email,
      password: hashedPassword,
    },
  });

  redirect("/auth/login");
};
