"use server";

import { CartWithProducts } from "@/actions/cartActions";
import Stripe from "stripe";
import prisma from "@/utils/db/prisma";
import { env } from "@/utils/env";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

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
          description: cartItem.product.id,
          images: [cartItem.selectedVariant.image],
        },
        unit_amount: cartItem.product.price * 100,
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
    const user = await getServerSession(authOptions);

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
      return existingOrder;
    }

    const userWithID = await prisma.user.findUnique({
      where: {
        email: user?.user.email || "",
      },
    });

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

    if (newOrder && userCart) {
      await removeCartFromUserAfterPayment(userCart);
    }

    // Returning newOrder
    return newOrder;
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Error creating order");
  }
};

export const removeCartFromUserAfterPayment = async (userCart: any) => {
  try {
    await prisma.cart.delete({
      where: {
        id: userCart.id,
      },
    });
  } catch (error) {
    console.error("Error deleting cart:", error);
    return new Error("Could not delete cart");
  }
};
