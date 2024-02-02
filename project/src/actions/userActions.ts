"use server";

import prisma from "@/utils/db/prisma";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

export const getUser = async (userID: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: {
      id: userID,
    },
  });

  return user;
};

export const registerUser = async (state: any, formData: FormData) => {
  try {
    // Destructure data from the formData
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    // Check if any field is missing
    if (!email || !password) {
      return {
        success: false,
        message: "Please fill in all the credentials",
      };
    }

    // Check if a user with the given email already exists
    const existOrNot = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existOrNot) {
      return {
        success: false,
        message: "A user with that email is already registered",
      };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });

    // Respond with the true

    return {
      success: true,
      message: "User successfully registered",
    };
  } catch (error: any) {
    // response with false

    return {
      success: false,
      error: "Please enter a valid email",
    };
  }
};
