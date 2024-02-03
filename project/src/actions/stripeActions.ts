"use server";

// This file contains functions related to managing checkout sessions, payments, and orders.

// Importing necessary modules and utilities
import { CartWithProducts } from "@/actions/cartActions";
import Stripe from "stripe";
import prisma from "@/utils/db/prisma";
import { env } from "@/utils/env";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; //

// Initializing Stripe with the secret key
const stripe = new Stripe(env.NEXT_STRIPE_SECRET_KEY);

// Interface defining the structure of an order
interface OrderInterface {
  id: string;
  orderId: string;
  totalAmount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

// Function to create a checkout session for the provided cart and user email
export const CreateCheckoutSession = async (
  cart: CartWithProducts | null,
  userEmail: string
) => {
  try {
    // Mapping cart items to line items compatible with Stripe
    const lineItems = cart?.items.map((cartItem) => ({
      price_data: {
        currency: "sek",
        product_data: {
          name: `${cartItem.product.name} variant ${cartItem.selectedVariant.color}, size ${cartItem.selectedVariant.size}`,
          description: cartItem.product.id,
          images: [cartItem.selectedVariant.image],
        },
        unit_amount: cartItem.product.price * 100,
      },
      quantity: cartItem.quantity,
    }));

    // Creating a new checkout session with Stripe
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      payment_method_types: ["card"],
      success_url:
        "http://localhost:3000/payment/successful?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000/payment/unsuccessful",
      customer_email: userEmail,
    });

    return session;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw new Error("Error creating checkout session");
  }
};

// Function to verify payment based on the provided session ID
export const verifyPayment = async (
  sessionId: string
): Promise<OrderInterface | null> => {
  try {
    // Retrieving session details from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Checking if the payment status is 'paid'
    if (session.payment_status === "paid") {
      // Creating an order based on the session details
      try {
        const orderDetails = await createOrder(sessionId, session);
        return orderDetails;
      } catch (userError) {
        throw new Error("Error creating order");
      }
    } else {
      return null;
    }
  } catch (error) {
    throw new Error("Error in verifyPayment");
  }
};

// Function to create an order based on the provided session ID and session details
export const createOrder = async (
  sessionId: string,
  session: Stripe.Response<Stripe.Checkout.Session>
) => {
  try {
    // Retrieving user session
    const user = await getServerSession(authOptions);

    // Checking if an order with the same sessionId already exists
    const existingOrder = await prisma.order.findUnique({
      where: {
        orderId: sessionId,
      },
      include: {
        orderedProduct: true,
      },
    });

    // Sending the existing order back to the frontend if found
    if (existingOrder) {
      return existingOrder;
    }

    // Retrieving user information based on session
    const userWithID = await prisma.user.findUnique({
      where: {
        email: user?.user.email || "",
      },
    });

    // Retrieving user's cart with items
    const userCart = await prisma.cart.findFirst({
      where: {
        userId: userWithID?.id,
      },
      include: {
        items: {
          include: {
            product: true,
            selectedVariant: true,
          },
        },
      },
    });

    // Mapping cart items to ordered product data
    const orderedProductsData = userCart?.items.map((cartItem: any) => ({
      name: cartItem.product.name,
      price: cartItem.product.price,
      quantity: cartItem.quantity,
      productId: cartItem.productId,
      genderCategory: cartItem.product.genderCategory,
      productCategory: cartItem.product.productCategory,
      defaultImg: cartItem.selectedVariant.image,
      orderId: sessionId,
    }));

    // Creating a new order in the database
    const newOrder = await prisma.order.create({
      data: {
        orderId: sessionId,
        totalAmount: session.amount_total || 0,
        status: session.payment_status,
        userId: userWithID?.id || "",
        orderedProduct: {
          create: orderedProductsData?.map((productData) => ({
            name: productData.name,
            price: productData.price / 100,
            quantity: productData.quantity,
            genderCategory: productData.genderCategory,
            productCategory: productData.productCategory,
            defaultImg: productData.defaultImg,
          })),
        },
      },
    });

    // If the order and user's cart exist, delete the cart after payment
    if (newOrder && userCart) {
      await removeCartFromUserAfterPayment(userCart);
    }

    // Returning the new order
    return newOrder;
  } catch (error) {
    throw new Error("Error creating order");
  }
};

// Function to remove a user's cart after payment
export const removeCartFromUserAfterPayment = async (userCart: any) => {
  try {
    // Deleting the user's cart from the database
    await prisma.cart.delete({
      where: {
        id: userCart.id,
      },
    });
  } catch (error) {
    return new Error("Could not delete cart");
  }
};
