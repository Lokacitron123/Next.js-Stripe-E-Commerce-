// This file contains functions that make operations on our database
// Reason for we are not creating API routes is that with prisma we get it fetch requests inbuilt
// One can still argue that it would be better to create API routes for conventions sake.

import { Cart, Prisma, Variant } from "@prisma/client";
import prisma from "@/utils/db/prisma";
import { cookies } from "next/dist/client/components/headers";

export type CartWithProducts = Prisma.CartGetPayload<{
  include: {
    items: {
      include: {
        product: { include: { variant: true } };
      };
    };
  };
}>;

export type CartItemWithProduct = Prisma.CartItemGetPayload<{
  include: {
    product: {
      include: {
        variant: true;
      };
    };
  };
}>;

export type ShoppingCart = CartWithProducts & {
  size: number;
  totalPrice: number;
};

// Retrieves a cart from database with product and correct variant
export const getCart = async (): Promise<ShoppingCart | null> => {
  const cartInLocalStorageId = cookies().get("cartInLocalStorageId")?.value;

  const cart = cartInLocalStorageId
    ? await prisma.cart.findUnique({
        where: { id: cartInLocalStorageId },
        include: {
          items: {
            include: {
              product: { include: { variant: true } },
            },
          },
        },
      })
    : null;

  if (!cart) {
    return null;
  }

  return {
    ...cart,
    size: cart.items.reduce((acc, item) => acc + item.quantity, 0),
    totalPrice: cart.items.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0
    ),
  };
};

export const createCart = async (): Promise<ShoppingCart> => {
  const newCart = await prisma.cart.create({
    data: {},
  });

  cookies().set("cartInLocalStorageId", newCart.id);

  return {
    ...newCart,
    items: [],
    size: 0,
    totalPrice: 0,
  };
};

export const reduceVariantQuantity = async (selectedVariantId: string) => {
  const selectedVariant = await prisma.variant.findUnique({
    where: { id: selectedVariantId },
  });

  if (!selectedVariant) {
    throw new Error("Variant not found");
  }

  // Decrement the quantity by 1 (make sure it never goes below 0)
  const newQuantity = Math.max(0, selectedVariant.quantity - 1);

  await prisma.variant.update({
    where: { id: selectedVariantId },
    data: { quantity: newQuantity },
  });
};
