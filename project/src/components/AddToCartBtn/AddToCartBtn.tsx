"use client";

import { useState } from "react";

interface AddToCartButtonProps {
  productId: string;
}

const AddToCartBtn = ({ productId }: AddToCartButtonProps) => {
  return (
    <div>
      <button>Lägg till produkt</button>
    </div>
  );
};
