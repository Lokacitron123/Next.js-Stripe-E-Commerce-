"use client";

import { useSession } from "next-auth/react";
import { verifyPayment } from "@/actions/stripeActions";
import { useSearchParams } from "next/navigation";

const SuccessfulpaymentPage = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") || ""; // sets a default value to make sure sessionId is not of type string | null when passed to verifyPayment
  const { data: session, status } = useSession();

  console.log("Found session", session);
  console.log("Logging status of auth: ", status);
  // Assuming verifyPayment takes session as an argument
  verifyPayment(sessionId, session);

  return <div>Payment successful</div>;
};

export default SuccessfulpaymentPage;
