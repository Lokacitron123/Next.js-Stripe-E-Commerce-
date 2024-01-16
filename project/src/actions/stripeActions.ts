import { CartWithProducts } from "@/actions/cartActions";
import Stripe from "stripe";

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
      success_url: "http://localhost:3000/payment/successful",
      cancel_url: "http://localhost:3000/payment/unsuccessful",
    });

    console.log("Checkout session created:", session);

    return session;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw new Error("Error creating checkout session");
  }
};
