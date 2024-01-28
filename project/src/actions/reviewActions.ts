"use server";

import prisma from "@/utils/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export const createReview = async (formData: FormData) => {
  try {
    const user = await getServerSession(authOptions);

    console.log("logging user", user);
    const foundUser = await prisma.user.findUnique({
      where: {
        email: user?.user.email || "",
      },
    });

    const userId = foundUser?.id;

    console.log("logging userID", userId);

    if (!userId) {
      console.log(user?.user.id);
      throw new Error("No user id available");
    }

    if (!formData) {
      throw new Error("Couldnt find form data");
    }

    const productName = formData.get("productName")?.toString();
    const comment = formData.get("comment")?.toString() ?? "";
    const rating = Number(formData.get("rating") || 0);

    const product = await prisma.product.findFirst({
      where: {
        name: productName,
      },
    });

    console.log("Found product by productName: ", product);

    await prisma.review.create({
      data: {
        comment: comment,
        rating: rating,
        userId: userId,
        productId: product?.id,
      },
    });

    revalidatePath("/userdashboard");
  } catch (error: any) {
    console.error(error.message);
  }
};

export const getReviews = async () => {
  try {
    const allReviews = await prisma.review.findMany();
    console.log(allReviews); // Do something with the retrieved reviews
    return allReviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
  }
};

export const getOrders = async (userId: any) => {
  const userOrders = await prisma.order.findMany({
    where: {
      userId: userId,
    },
    include: {
      orderedProduct: true,
    },
  });

  return userOrders;
};
