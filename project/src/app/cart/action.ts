"use server";

// This file contains functions related to managing cart actions such as deleting products, incrementing, and decreasing quantities, and interacting with the database.

// Importing necessary modules and utilities
import { getCart, createCart } from "@/actions/cartActions"; // Importing cart actions for retrieving or creating carts
import { Variant } from "@prisma/client"; // Importing Variant type from Prisma for type annotations
import { error } from "console"; // Importing console error utility for logging errors
import { revalidatePath } from "next/cache"; // Importing cache revalidation from Next.js for updating cache
import prisma from "@/utils/db/prisma"; // Importing Prisma for database operations

// Function to delete a product from the cart
export const deleteProductInCart = async (
  productId: string,
  selectedVariant: Variant
) => {
  // Retrieving cart information or creating a new cart if not found
  const cart = (await getCart()) ?? (await createCart());

  // Finding the existing cart item
  const existingCartItem = cart.items.find(
    (item) =>
      item.productId === productId &&
      item.selectedVariantId === selectedVariant.id
  );

  // If the variant quantity exists
  if (existingCartItem?.selectedVariant.quantity) {
    // Retrieving the variant information from the database
    const variant = await prisma.variant.findUnique({
      where: {
        id: existingCartItem.selectedVariant.id,
      },
    });

    // If the variant is found, increment the quantity
    if (variant) {
      await prisma.variant.update({
        where: {
          id: variant.id,
        },
        data: {
          quantity: {
            increment: existingCartItem.quantity,
          },
        },
      });
    }

    // Deleting the cart item
    await prisma.cartItem.delete({
      where: {
        id: existingCartItem.id,
      },
    });
  } else {
    console.log("Couldnt delete the product");
    return;
  }

  // Revalidating the cache for the cart page
  revalidatePath("/cart");
};

// Function to increment the quantity of a selected variant in the cart
export const incrementSelectedVariantInCart = async (
  productId: string,
  selectedVariant: Variant
) => {
  // Retrieving cart information or creating a new cart if not found
  const cart = (await getCart()) ?? (await createCart());

  // Finding the existing cart item
  const existingCartItem = cart.items.find(
    (item) =>
      item.productId === productId &&
      item.selectedVariantId === selectedVariant.id
  );

  // If the variant quantity exists
  if (existingCartItem?.selectedVariant.quantity) {
    // Incrementing the quantity of the cart item by 1
    await prisma.cartItem.update({
      where: {
        id: existingCartItem.id,
      },
      data: { quantity: { increment: 1 } },
    });

    // Decrementing the quantity of the product variant when increasing the quantity of the cart item by 1
    await prisma.variant.update({
      where: {
        id: existingCartItem.selectedVariant.id,
      },
      data: {
        quantity: {
          decrement: 1,
        },
      },
    });
  } else {
    console.log("couldnt update the quantity of selected product");
    return;
  }

  // Revalidating the cache for the cart page
  revalidatePath("/cart");
};

// Function to decrease the quantity of a selected variant in the cart
export const decreaseSelectedVariantInCart = async (
  productId: string,
  selectedVariant: Variant
) => {
  // Retrieving cart information or creating a new cart if not found
  const cart = (await getCart()) ?? (await createCart());

  // Finding the existing cart item
  const existingCartItem = cart.items.find(
    (item) =>
      item.productId === productId &&
      item.selectedVariantId === selectedVariant.id
  );

  // If the variant quantity exists
  if (existingCartItem?.selectedVariant.quantity) {
    // Decreasing the quantity of the cart item by 1
    await prisma.cartItem.update({
      where: {
        id: existingCartItem.id,
      },
      data: { quantity: { decrement: 1 } },
    });

    // Incrementing back the quantity of the product variant when decreasing the quantity of the cart item by 1
    await prisma.variant.update({
      where: {
        id: existingCartItem.selectedVariant.id,
      },
      data: {
        quantity: {
          increment: 1,
        },
      },
    });
  } else {
    console.log("couldnt decrease the quantity of selected product");
    return;
  }

  // Revalidating the cache for the cart page
  revalidatePath("/cart");
};
