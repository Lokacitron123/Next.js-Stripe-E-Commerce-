"use server";

import { CartWithProducts } from "@/actions/cartActions";
import { Order, User } from "@prisma/client";
import Stripe from "stripe";
import prisma from "@/utils/db/prisma";

const stripe = new Stripe(
  "sk_test_51OZDqDAx1nxWOiL6ZOACQUcRAEQ7dZPWl4WXQ1fer4wGg3MmZYmORmLcwufJ0iVp13rZJGhoLmxgiJvQINxRzu8w00MVGQ5YMJ"
);

export const CreateCheckoutSession = async (cart: CartWithProducts | null) => {
  try {
    const lineItems = cart?.items.map((cartItem) => ({
      price_data: {
        currency: "sek",
        product_data: {
          name: cartItem.product.name,
          description: cartItem.product.description,
          images: [cartItem.product.defaultImg],
        },
        unit_amount: cartItem.product.price,
      },
      quantity: cartItem.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      payment_method_types: ["card"],
      success_url:
        "http://localhost:3000/payment/successful?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000/payment/unsuccessful",
    });

    return session;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw new Error("Error creating checkout session");
  }
};

export const verifyPayment = async (sessionId: string, userEmail: string) => {
  try {
    const checkout = await stripe.checkout.sessions.retrieve(sessionId);

    console.log("logging session in backend", userEmail);
    console.log("checkout", checkout);

    const products = await stripe.checkout.sessions.listLineItems(sessionId);

    // console.log("logging lineitems", products);
    if (checkout.payment_status === "paid") {
      console.log("inside of payment paid check");
      // find the user who paid by checking the logged in user's session
      try {
        // find the user who paid by checking the logged-in user's session
        const payingUser = await prisma.user.findUnique({
          where: {
            email: userEmail,
          },
        });

        console.log("logging payingUser", payingUser);
        createOrder(sessionId, checkout, payingUser);
      } catch (userError) {
        console.error("Error finding user:", userError);
      }
    } else {
      console.log("Payment not successful");
    }
  } catch (error) {
    console.error("Error in verifyPayment:", error);
  }
};

export const createOrder = async (
  sessionId: string,
  checkout: Stripe.Response<Stripe.Checkout.Session>,
  payingUser: User | null
) => {
  try {
    const products = await stripe.checkout.sessions.listLineItems(sessionId);

    const newOrder = await prisma.order.create({
      data: {
        totalAmount: checkout.amount_total || 0,
        status: checkout.payment_status,
        user: {
          connect: { id: payingUser?.id },
        },
        orderedProduct: {
          create: products.data.map((lineItem) => ({
            name: lineItem.description || "",
            price: lineItem.amount_total || 0,
            quantity: lineItem.quantity || 0,
            genderCategory: "",
            productCategory: "",
            defaultImg: "",
          })),
        },
      },
    });

    console.log("New Order created:", newOrder); // Log the new order details

    return newOrder;
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Error creating order");
  }
};
