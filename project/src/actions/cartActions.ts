// This file contains functions that make operations on our database
// Reason for we are not creating API routes is that with prisma we get it fetch requests inbuilt
// One can still argue that it would be better to create API routes for conventions sake.

import { Cart, CartItem, Prisma, User, Variant } from "@prisma/client";
import prisma from "@/utils/db/prisma";
import { cookies } from "next/dist/client/components/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export type CartWithProducts = Prisma.CartGetPayload<{
  include: {
    items: {
      include: { product: true; selectedVariant: true };
    };
  };
}>;

export type CartItemWithProduct = Prisma.CartItemGetPayload<{
  include: { product: true; selectedVariant: true };
}>;

export type ShoppingCart = CartWithProducts & {
  size: number;
  totalPrice: number;
};

// Retrieves a cart from database with product and correct variant
export const getCart = async (): Promise<ShoppingCart | null> => {
  const session = await getServerSession(authOptions);

  let cart: CartWithProducts | null = null;

  if (session) {
    const userId = await prisma.user.findUnique({
      where: {
        email: session?.user?.email || "",
      },
    });

    // find the cart with userId from found user matching user in session and retrievies it
    cart = await prisma.cart.findFirst({
      where: { userId: userId?.id },
      include: {
        items: {
          include: {
            product: true,
            selectedVariant: true,
          },
        },
      },
    });
  } else {
    // If user is not logged in, find a cart with the id from cookie

    const cartInLocalStorageId = cookies().get("cartInLocalStorageId")?.value;

    cart = cartInLocalStorageId
      ? await prisma.cart.findUnique({
          where: { id: cartInLocalStorageId },
          include: {
            items: {
              include: {
                product: true,
                selectedVariant: true,
              },
            },
          },
        })
      : null;
  }

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

// Create cart logic
export const createCart = async (): Promise<ShoppingCart> => {
  const session = await getServerSession(authOptions);

  // Declare a cart
  // We declare it as empty
  let newCart: Cart;

  //

  if (session) {
    const userId = await prisma.user.findUnique({
      where: {
        email: session?.user?.email || "",
      },
    });

    newCart = await prisma.cart.create({
      data: { userId: userId?.id },
    });
  } else {
    // if not logged in, creates cart and stores it in a cookie
    newCart = await prisma.cart.create({
      data: {},
    });

    cookies().set("cartInLocalStorageId", newCart.id);
  }

  return {
    ...newCart,
    items: [],
    size: 0,
    totalPrice: 0,
  };
};

// Merge localStorage cart with logged in user cart
export const mergeLocalCartWithUserCart = async (userEmail: string) => {
  // getting the userID

  // find user with mail from session
  // id is not returned by the session normally but we need it to identify the users cart
  // Therefor we find it by finding the user first by email on the session
  const user = await prisma.user.findUnique({
    where: {
      email: userEmail || "",
    },
  });

  if (!user) {
    return null;
  }

  const cartInLocalStorageId = cookies().get("cartInLocalStorageId")?.value;

  const localCart = cartInLocalStorageId
    ? await prisma.cart.findUnique({
        where: { id: cartInLocalStorageId },
        include: {
          items: true,
        },
      })
    : null;

  if (!localCart) {
    return;
  }

  // find the the cart belonging to logged in user by the userID field on the cart.
  const userCart = await prisma.cart.findFirst({
    where: { userId: user.id },
    include: { items: true },
  });

  // make transaction mutation
  // documentation: https://www.prisma.io/docs/orm/prisma-client/queries/transactions
  await prisma.$transaction(async (tx) => {
    if (userCart) {
      console.log("Merging with existing user cart");
      const mergedCartItems = mergeCartItems(localCart?.items, userCart.items);

      console.log("Merged Cart Items:", mergedCartItems);
      await tx.cartItem.deleteMany({
        where: { cartId: userCart.id },
      });

      await tx.cartItem.createMany({
        data: mergedCartItems.map((item) => ({
          cartId: userCart.id,
          productId: item.productId,
          quantity: item.quantity,
          selectedVariantId: item.selectedVariantId,
        })),
      });
    } else {
      console.log("Creating new user cart");
      await tx.cart.create({
        data: {
          userId: user.id,
          items: {
            createMany: {
              data: localCart.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                selectedVariantId: item.selectedVariantId,
              })),
            },
          },
        },
      });
    }

    await tx.cart.delete({
      where: { id: localCart.id },
    });
    console.log("End of Transaction");
    // Deleting the cookie with our cart information in local storage
    cookies().set("cartInLocalStorageId", "");
  });
};

// MergeCartItems logic because we need to declare it and invoke it in mergeLocalCartWithUserCart
// ...cart is variadic, meaning this function can take on how many arguments as we please if we want to merge several carts
// Merges multiple arrays of cart items, summing the quantities of items with the same productId.
const mergeCartItems = (...cartItems: CartItem[][]) => {
  // Use the reduce function to merge multiple arrays into a single array
  return cartItems.reduce((acc, items) => {
    // Iterate through items in the current array
    items.forEach((item) => {
      // Check if an item with the same productId already exists in the accumulated result
      const existingItem = acc.find((i) => i.productId === item.productId);

      // If the item exists, update its quantity
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        // If the item doesn't exist, add a new entry to the accumulated result
        acc.push(item);
      }
    });

    // Return the accumulated result for the next iteration
    return acc;
  }, [] as CartItem[]);
};

// Reducing variantQuantity logic - variants hold their own stock since they are variants of a product
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
