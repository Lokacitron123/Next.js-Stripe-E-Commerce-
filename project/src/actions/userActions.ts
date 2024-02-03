"use server";

// This file contains functions related to user management such as user retrieval and registration.

// Importing necessary modules and utilities
import prisma from "@/utils/db/prisma"; // Importing Prisma for database operations
import { User } from "@prisma/client"; // Importing User type from Prisma
import bcrypt from "bcrypt"; // Importing bcrypt for password hashing

// Function to retrieve a user based on user ID
export const getUser = async (userID: string): Promise<User | null> => {
  // Retrieving user information from the database
  const user = await prisma.user.findUnique({
    where: {
      id: userID,
    },
  });

  return user;
};

// Function to register a new user
export const registerUser = async (state: any, formData: FormData) => {
  try {
    // Destructuring data from the formData
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    // Checking if any field is missing
    if (!email || !password) {
      return {
        success: false,
        message: "Please fill in all the credentials",
      };
    }

    // Checking if a user with the given email already exists
    const existOrNot = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    // If user already exists, return a failure message
    if (existOrNot) {
      return {
        success: false,
        message: "A user with that email is already registered",
      };
    }

    // Hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creating a new user in the database
    await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });

    // Responding with a success message
    return {
      success: true,
      message: "User successfully registered",
    };
  } catch (error: any) {
    // Responding with a failure message in case of error
    return {
      success: false,
      error: "Please enter a valid email",
    };
  }
};
