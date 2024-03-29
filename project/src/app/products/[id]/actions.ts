"use server";

import {
  createCart,
  getCart,
  reduceVariantQuantity,
} from "@/actions/cartActions";
import prisma from "@/utils/db/prisma";
import { Variant } from "@prisma/client";
import { revalidatePath } from "next/cache";

// This file contains functions associated with the cart component
const incrementProductQuantityInCart = async (
  productId: string,
  selectedVariant: Variant
) => {
  const cart = (await getCart()) ?? (await createCart());

  const existingCartItem = cart.items.find(
    (item) =>
      item.productId === productId &&
      item.selectedVariantId === selectedVariant.id
  );

  if (existingCartItem) {
    await prisma.cartItem.update({
      where: { id: existingCartItem.id },
      data: { quantity: { increment: 1 } },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: productId,
        quantity: 1,
        selectedVariantId: selectedVariant.id,
      },
    });
  }

  await reduceVariantQuantity(selectedVariant.id);
  // updates the url from this path
  // we update in order to see the changes
  revalidatePath("/products/[id]", "page");
};

export default incrementProductQuantityInCart;
