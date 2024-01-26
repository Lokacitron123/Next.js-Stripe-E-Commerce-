import prisma from "@/utils/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

type ReviewProps = {
  comment: string;
  rating: number;
  userId: string;
  productName: string;
};

export const createReview = async (reviewData: ReviewProps) => {
  try {
    const user = await getServerSession(authOptions);

    const userID = user?.user.id;

    if (!userID) {
      console.log(user?.user.id);
      throw new Error("No user id available");
    }

    if (!reviewData) {
      throw new Error("Couldnt find review data");
    }

    const productName = reviewData.productName;

    const hasBoughtProduct = await hasOrderedProduct(productName, userID);

    if (!hasBoughtProduct) {
      throw new Error("Could not find product in user's order history");
    }

    await prisma.review.create({
      data: {
        comment: reviewData.comment,
        rating: reviewData.rating,
        userId: reviewData.userId,
        productId: reviewData.productName,
      },
    });

    revalidatePath("/products/[id]", "page");
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

const hasOrderedProduct = async (productName: string, userId: string) => {
  const userWithBoughtProduct = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      Order: {
        include: {
          orderedProduct: {
            where: {
              name: productName,
            },
          },
        },
      },
    },
  });

  return userWithBoughtProduct;
};
