"use client";

import { useSession } from "next-auth/react";
import { CartWithProducts } from "@/actions/cartActions";
import { CreateCheckoutSession } from "@/actions/stripeActions";
import { loadStripe } from "@stripe/stripe-js";

// I mentioned in my presentation that my code had turned to a spaghettimonster and this is an example of it. I build my logic around useSession that is the client side authentication of next-auth, but doing it this way I couldnt load my env variables due to it being a client component. env is used server side. Noticed this too late to change so now im stuck hardcoding the value of my public key.

// Initialize Stripe with the provided public key
const stripePromise = loadStripe(
  "pk_test_51OZDqDAx1nxWOiL6OrbSfp7u2RmqFqqe0tAHiIbrfh8KA7RGRsilCcij8vTKyjwBkY1SO2HV9dczsxIv5stbcKLL00yL9zZAOy"
);

type CheckoutBtnProps = {
  cart: CartWithProducts | null;
};

const CheckoutBtn = ({ cart }: CheckoutBtnProps) => {
  // Use the useSession hook to retrieve session data
  const { data: session, status } = useSession();

  // Extract the user's email from the session data or set it to an empty string
  const userEmail = session?.user.email ?? "";

  // Define the function to handle the checkout process
  const handleCheckout = async () => {
    try {
      // Check if the user is authenticated
      if (status === "authenticated") {
        // Create a checkout session using the provided cart and user email
        const session = await CreateCheckoutSession(cart, userEmail);

        // Retrieve the Stripe instance from the stripePromise
        const stripe = await stripePromise;

        // Redirect the user to the Stripe Checkout page with the session ID
        const { error }: any = await stripe?.redirectToCheckout({
          sessionId: session.id,
        });

        // Handle any errors during the redirection process
        if (error) {
          if (error instanceof Error) throw new Error(error.message);
        } else {
          throw error;
        }
      }
    } catch (error) {
      // Log and handle errors during the checkout process
      console.error("Error handling checkout:", error);
    }
  };

  // Render the checkout button, enabling it only if the user is authenticated
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
