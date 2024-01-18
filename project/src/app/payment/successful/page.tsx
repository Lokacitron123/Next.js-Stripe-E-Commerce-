"use client";
import { useSession } from "next-auth/react";
import { verifyPayment } from "@/actions/stripeActions";
import { useSearchParams } from "next/navigation";
import VerifyPayment from "./verifyPayment";
import { useEffect, useState } from "react";

const SuccessfulpaymentPage = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") || ""; // sets a default value to make sure sessionId is not of type string | null when passed to verifyPayment
  const [isLoading, setIsLoading] = useState(true);
  const session = useSession();

  // console.log("Found session", session);

  const userEmail = session.data?.user?.email ?? "";

  useEffect(() => {
    const performVerification = async () => {
      try {
        await verifyPayment(sessionId, userEmail);
        console.log("Payment verification successful");
      } catch (error) {
        console.error("Error in payment verification:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (sessionId && userEmail && isLoading) {
      performVerification();
    }
  }, [sessionId, userEmail, isLoading]);

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <VerifyPayment sessionId={sessionId} userEmail={userEmail} />
  );
};
// console.log("log userEmail", userEmail);

// verifyPayment(sessionId, userEmail);

// return <div>Payment successful</div>;
// return <VerifyPayment sessionId={sessionId} userEmail={userEmail} />;

export default SuccessfulpaymentPage;
