"use client";

import { verifyPayment } from "@/actions/stripeActions";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Order } from "@prisma/client";
import { useRouter } from "next/navigation";

const SuccessfulpaymentPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") || ""; // sets a default value to make sure sessionId is not of type string | null when passed to verifyPayment
  const [isLoading, setIsLoading] = useState(true);
  const hinderDoubleRend = useRef(false);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (hinderDoubleRend.current === false) {
      const performVerification = async () => {
        try {
          const result = await verifyPayment(sessionId);
          console.log("Payment verification successful");

          setOrder(result);

          console.log("Order details:", result);
        } catch (error) {
          console.error("Error in payment verification:", error);
        } finally {
          router.refresh(); // refresh page to show correct amount of items in cart
          setIsLoading(false);
        }
      };

      performVerification();

      return () => {
        hinderDoubleRend.current = true;
      };
    }
  }, [sessionId, router]);

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div>
      {order ? (
        <div>
          <h1>Payment succesful</h1>
          <p>Here are your product details</p>
          <h2>Order Details</h2>
          <p>Order ID: {order.orderId}</p>
          <p>Total Amount: {order.totalAmount / 100} kr</p>
          <p>{}</p>
        </div>
      ) : (
        <div>No order details available.</div>
      )}
    </div>
  );
};

export default SuccessfulpaymentPage;
