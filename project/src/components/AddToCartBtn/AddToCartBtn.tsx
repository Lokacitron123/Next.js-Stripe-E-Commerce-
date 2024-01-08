"use client";

import { useState, useTransition } from "react";

interface AddToCartButtonProps {
  productId: string;
  incrementProductQuantityInCart: (productId: string) => Promise<void>;
}

// Docs for useTransition and server actions: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations

const AddToCartBtn = ({
  productId,
  incrementProductQuantityInCart,
}: AddToCartButtonProps) => {
  let [isPending, startTransition] = useTransition();
  const [succesful, setSuccesful] = useState(false);

  return (
    <div className='flex items-center gap-2'>
      <button
        className='btn btn-primary'
        onClick={() => {
          setSuccesful(false);
          startTransition(async () => {
            await incrementProductQuantityInCart(productId);
            setSuccesful(true);
          });
        }}
      >
        Lägg till produkt
      </button>
      {isPending && <span className='loading loading-dots loading-md' />}
      {!isPending && succesful && (
        <span className='text-success'>Lades till i varukorg</span>
      )}
    </div>
  );
};

export default AddToCartBtn;
