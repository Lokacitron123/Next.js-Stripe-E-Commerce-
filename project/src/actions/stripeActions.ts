import { CartWithProducts } from "@/actions/cartActions";
import { Order } from "@prisma/client";
import Stripe from "stripe";
import prisma from "@/utils/db/prisma";

const stripe = new Stripe(
  "sk_test_51OZDqDAx1nxWOiL6ZOACQUcRAEQ7dZPWl4WXQ1fer4wGg3MmZYmORmLcwufJ0iVp13rZJGhoLmxgiJvQINxRzu8w00MVGQ5YMJ"
);

export const CreateCheckoutSession = async (cart: CartWithProducts | null) => {
  try {
    console.log("Creating checkout session...");

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

export const verifyPayment = async (sessionId: string, session: any) => {
  try {
    const checkout = await stripe.checkout.sessions.retrieve(sessionId);

    if (checkout.payment_status === "paid") {
      const payingUser = prisma.user.findUnique(session);

      console.log("Payment successful");
      createOrder(sessionId, checkout, session);
    } else {
      console.log("Payment not successful");
    }
  } catch (error) {}
};

export const createOrder = async (
  sessionId: string,
  checkout: Stripe.Response<Stripe.Checkout.Session>,
  session: any
) => {
  const products = await stripe.checkout.sessions.listLineItems(sessionId);

  const newOrder = {
    totalAmount: checkout.amount_total !== null ? checkout.amount_total : 0, // Because stripe sends me back a value that can number or null
    status: checkout.payment_status,
  };

  // const createdOrder = prisma.order.create({
  //   data: newOrder,
  //   include: {
  //     user:
  //   }
  // });
};
