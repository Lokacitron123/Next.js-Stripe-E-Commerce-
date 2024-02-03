"use server";

// This file contains logic for creating a review after a user has placed an order

// Importing necessary modules and utilities
import prisma from "@/utils/db/prisma"; // Importing Prisma for database operations
import { getServerSession } from "next-auth"; // Importing session management from NextAuth
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Importing authentication options
import { revalidatePath } from "next/cache"; // Importing cache revalidation from Next.js

// Function to create a review based on form data
export const createReview = async (formData: FormData) => {
  try {
    // Retrieving user session
    const user = await getServerSession(authOptions);

    // Logging the user information
    console.log("logging user", user);

    // Finding the user in the database based on email
    const foundUser = await prisma.user.findUnique({
      where: {
        email: user?.user.email || "", // Retrieving user's email from session
      },
    });

    // Retrieving the user ID
    const userId = foundUser?.id;

    // Logging the user ID
    console.log("logging userID", userId);

    // If user ID is not found, throw an error
    if (!userId) {
      console.log(user?.user.id);
      throw new Error("No user id available");
    }

    // If form data is not provided, throw an error
    if (!formData) {
      throw new Error("Couldn't find form data");
    }

    // Retrieving product name, comment, and rating from form data
    const productName = formData.get("productName")?.toString();
    const comment = formData.get("comment")?.toString() ?? "";
    const rating = Number(formData.get("rating") || 0);

    // Finding the product in the database based on name
    const product = await prisma.product.findFirst({
      where: {
        name: productName,
      },
    });

    // Creating a new review in the database
    await prisma.review.create({
      data: {
        comment: comment,
        rating: rating,
        userId: userId,
        productId: product?.id,
      },
    });

    // Revalidating the cache for the user dashboard page
    revalidatePath("/userdashboard");
  } catch (error: any) {
    // Handling errors
    console.error(error.message);
  }
};

// Function to retrieve reviews for a specific product
export const getReviews = async (productId: string) => {
  try {
    // Retrieving all reviews for the specified product ID
    const allReviews = await prisma.review.findMany({
      where: {
        id: productId,
      },
    });

    // Returning the retrieved reviews
    return allReviews;
  } catch (error) {
    // Handling errors
    console.error("Error fetching reviews:", error);
  }
};

// Function to retrieve orders for a specific user
export const getOrders = async (userId: any) => {
  // Retrieving all orders for the specified user ID
  const userOrders = await prisma.order.findMany({
    where: {
      userId: userId,
    },
    include: {
      orderedProduct: true,
    },
  });

  // Returning the retrieved user orders
  return userOrders;
};
