"use server";

import { CartWithProducts } from "@/actions/cartActions";
import { Cart, CartItem, Order, Prisma, User } from "@prisma/client";
import Stripe from "stripe";
import prisma from "@/utils/db/prisma";

const stripe = new Stripe(
  "sk_test_51OZDqDAx1nxWOiL6ZOACQUcRAEQ7dZPWl4WXQ1fer4wGg3MmZYmORmLcwufJ0iVp13rZJGhoLmxgiJvQINxRzu8w00MVGQ5YMJ"
);

interface OrderInterface {
  id: string;
  orderId: string;
  totalAmount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export const CreateCheckoutSession = async (
  cart: CartWithProducts | null,
  userEmail: string
) => {
  try {
    const lineItems = cart?.items.map((cartItem) => ({
      price_data: {
        currency: "sek",
        product_data: {
          name: `${cartItem.product.name} variant ${cartItem.selectedVariant.color}, size ${cartItem.selectedVariant.size}`,
          description: cartItem.product.description,
          images: [cartItem.selectedVariant.image],
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
      customer_email: userEmail,
    });

    return session;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw new Error("Error creating checkout session");
  }
};

export const verifyPayment = async (
  sessionId: string
): Promise<OrderInterface | null> => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      console.log("inside of payment paid check");
      // find the user who paid by checking the logged in user's session
      try {
        const orderDetails = await createOrder(sessionId, session);
        // returning the order from createOrder
        return orderDetails;
      } catch (userError) {
        console.error("Error creating order:", userError);
        throw new Error("Error creating order");
      }
    } else {
      console.log("Payment not successful");
      return null;
    }
  } catch (error) {
    console.error("Error in verifyPayment:", error);
    throw new Error("Error in verifyPayment");
  }
};

export const createOrder = async (
  sessionId: string,
  session: Stripe.Response<Stripe.Checkout.Session>
) => {
  try {
    // Check if an order with the same sessionId already exists
    // To prevent the order from being recreated
    const existingOrder = await prisma.order.findUnique({
      where: {
        orderId: sessionId,
      },
      include: {
        orderedProduct: true,
      },
    });

    // Sends the order if already existing back to the frontend
    // preventing a duplication of the same order
    if (existingOrder) {
      console.log("Order already exists:", existingOrder);

      return existingOrder;
    }

    // finding cart in database via the paying user's email
    // A user has to be logged in and provide the email they signed the account with to pay
    // Thus we can use it populate the order / orderedItems with the items found in cart / cartItems
    const payingUserWithCartAndItems = await prisma.user.findUnique({
      where: {
        email: session?.customer_email || "",
      },
      include: {
        Cart: {
          include: {
            items: {
              include: {
                product: true,
                selectedVariant: true,
              },
            },
          },
        },
      },
    });

    console.log("log paying user", payingUserWithCartAndItems);

    if (payingUserWithCartAndItems) {
      console.log("User ID:", payingUserWithCartAndItems.id);
      const payingUserCartWithItems: Cart | null = await prisma.cart.findUnique(
        {
          where: {
            id: payingUserWithCartAndItems.id,
          },
        }
      );

      console.log("logging payingusercart", payingUserCartWithItems);

      if (payingUserCartWithItems) {
        const userCart: Cart = payingUserCartWithItems;

        console.log("User:", payingUser);
        console.log("User Cart:", userCart);
      } else {
        console.log("User has no cart.");
      }
    } else {
      console.log("User not found.");
    }

    const newOrder = await prisma.order.create({
      data: {
        orderId: sessionId,
        totalAmount: session.amount_total || 0,
        status: session.payment_status,
        user: {
          connect: { email: session.customer_email || "" },
        },
        // orderedProduct: {
        //   create: userCart?.data.map((item) => ({
        //     name: item. || "",
        //     price: lineItem.amount_total || 0,
        //     quantity: lineItem.quantity || 0,
        //     genderCategory: "",
        //     productCategory: "",
        //     defaultImg: "",
        //   })),
        // },
      },
    });

    console.log("New Order created:", newOrder); // Log the new order details

    // Returning newOrder
    return newOrder;
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Error creating order");
  }
};

export const reduceQuantityInDB = () => {};
