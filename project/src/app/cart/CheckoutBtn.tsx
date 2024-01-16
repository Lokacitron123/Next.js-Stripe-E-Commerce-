"use client";

import { useSession } from "next-auth/react";
import { CartWithProducts } from "@/actions/cartActions";
import { CreateCheckoutSession } from "@/actions/stripeActions";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(
  "pk_test_51OZDqDAx1nxWOiL6OrbSfp7u2RmqFqqe0tAHiIbrfh8KA7RGRsilCcij8vTKyjwBkY1SO2HV9dczsxIv5stbcKLL00yL9zZAOy"
);

type CheckoutBtnProps = {
  cart: CartWithProducts | null;
};

const CheckoutBtn = ({ cart }: CheckoutBtnProps) => {
  const { data: session, status } = useSession();

  const handleCheckout = async () => {
    try {
      if (status === "authenticated") {
        const session = await CreateCheckoutSession(cart);

        const stripe = await stripePromise;
        const { error }: any = await stripe?.redirectToCheckout({
          sessionId: session.id,
        });

        if (error) {
          if (error instanceof Error) throw new Error(error.message);
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error("Error handling checkout:", error);
      // Handle error, display a message to the user, etc.
    }
  };

  return session ? (
    <button className='btn btn-primary' onClick={handleCheckout}>
      Betala
    </button>
  ) : (
    <button className='btn btn-primary' disabled>
      Betala
    </button>
  );
};

export default CheckoutBtn;
