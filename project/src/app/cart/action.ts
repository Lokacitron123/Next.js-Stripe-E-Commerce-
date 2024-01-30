"use server";

import { getCart, createCart } from "@/actions/cartActions";
import { Variant } from "@prisma/client";
import { error } from "console";
import { revalidatePath } from "next/cache";
import prisma from "@/utils/db/prisma";

export const deleteProductInCart = async (
  productId: string,
  selectedVariant: Variant
) => {
  const cart = (await getCart()) ?? (await createCart());

  const existingCartItem = cart.items.find(
    (item) =>
      item.productId === productId &&
      item.selectedVariantId === selectedVariant.id
  );

  if (existingCartItem?.selectedVariant.quantity) {
    const variant = await prisma.variant.findUnique({
      where: {
        id: existingCartItem.selectedVariant.id,
      },
    });

    if (variant) {
      // Increment the quantity of the Variant

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

    await prisma.cartItem.delete({
      where: {
        id: existingCartItem.id,
      },
    });
  } else {
    console.log("Couldnt delete the product");
    return;
  }

  revalidatePath("/cart");
};

export const incrementSelectedVariantInCart = async (
  productId: string,
  selectedVariant: Variant
) => {
  const cart = (await getCart()) ?? (await createCart());

  const existingCartItem = cart.items.find(
    (item) =>
      item.productId === productId &&
      item.selectedVariantId === selectedVariant.id
  );

  if (existingCartItem?.selectedVariant.quantity) {
    // Increment the quantity of the cartItem by 1
    await prisma.cartItem.update({
      where: {
        id: existingCartItem.id,
      },
      data: { quantity: { increment: 1 } },
    });

    // Decrement  the quantity of a product variant when increasing quanity of cartItem by 1
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

  revalidatePath("/cart");
};

export const decreaseSelectedVariantInCart = async (
  productId: string,
  selectedVariant: Variant
) => {
  const cart = (await getCart()) ?? (await createCart());

  const existingCartItem = cart.items.find(
    (item) =>
      item.productId === productId &&
      item.selectedVariantId === selectedVariant.id
  );

  if (existingCartItem?.selectedVariant.quantity) {
    // decrease the quantity of the cartItem by 1
    await prisma.cartItem.update({
      where: {
        id: existingCartItem.id,
      },
      data: { quantity: { decrement: 1 } },
    });

    // Increment back the quantity of a product variant when decreasing quanity of cartItem by 1
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

  revalidatePath("/cart");
};
