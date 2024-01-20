import React from "react";
import { verifyPayment } from "@/actions/stripeActions";

interface VerifyPaymentProps {
  sessionId: string;
}

const VerifyPayment = ({ sessionId }: VerifyPaymentProps) => {
  verifyPayment(sessionId);

  return <div>Payment successfull</div>;
};

export default VerifyPayment;
