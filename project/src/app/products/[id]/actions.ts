"use server";

import { createCart, getCart } from "@/actions/cartActions";
import prisma from "@/utils/db/prisma";
import { Variant } from "@prisma/client";
import { revalidatePath } from "next/cache";

// This file contains functions associated with the cart component
const incrementProductQuantityInCart = async (
  productId: string,
  selectedVariant: Variant
) => {
  const cart = (await getCart()) ?? (await createCart());

  const productInCart = cart.items.find((item) => item.productId === productId);

  if (productInCart) {
    await prisma.cartItem.update({
      where: { id: productInCart.id },
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

  // updates the url from this path
  // we update in order to see the changes
  revalidatePath("/products/[id]", "page");
};

export default incrementProductQuantityInCart;
