"use client";

import { verifyPayment } from "@/actions/stripeActions";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

interface Order {
  id: string;
  orderId: string;
  totalAmount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

const SuccessfulpaymentPage = () => {
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
          setIsLoading(false);
        }
      };

      performVerification();

      return () => {
        hinderDoubleRend.current = true;
      };
    }
  }, [sessionId]);

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
          <p>Total Amount: {order.totalAmount}</p>
          <p>{}</p>
        </div>
      ) : (
        <div>No order details available.</div>
      )}
    </div>
  );
};

export default SuccessfulpaymentPage;
