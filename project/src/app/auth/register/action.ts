"use Server";

import prisma from "@/utils/db/prisma";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";

export const registerUser = async (formData: FormData) => {
  "use server";

  const username = formData.get("username")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[^\w\s]).{5,}$/;

  if (!email || !emailRegex.test(email)) {
    throw new Error("Please enter a valid email address");
  }

  if (!password || !passwordRegex.test(password)) {
    throw new Error(
      "Password must be at least 5 characters long and contain at least 1 special symbol"
    );
  }

  const existingUsernameAndOrEmail = await prisma.user.findFirst({
    where: {
      username: username,
      email: email,
    },
  });

  if (existingUsernameAndOrEmail) {
    throw Error("Username and or email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      username: username,
      email: email,
      password: hashedPassword,
    },
  });

  redirect("/auth/login");
};
