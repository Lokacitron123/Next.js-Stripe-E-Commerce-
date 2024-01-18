import React from "react";
import { verifyPayment } from "@/actions/stripeActions";

interface VerifyPaymentProps {
  sessionId: string;
  userEmail: string;
}

const VerifyPayment = ({ sessionId, userEmail }: VerifyPaymentProps) => {
  verifyPayment(sessionId, userEmail);

  return <div>Payment successfull</div>;
};

export default VerifyPayment;
