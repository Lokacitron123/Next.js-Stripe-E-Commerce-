"use client";

import { startTransition, useTransition } from "react";

interface DeleteProductProp {
  productId: string;
  deleteProduct: (productId: string) => Promise<void>;
}

const DeleteProductBtn = ({ productId, deleteProduct }: DeleteProductProp) => {
  let [isPending, startTransition] = useTransition();

  return (
    <button
      className='btn btn-primary'
      onClick={() =>
        startTransition(async () => await deleteProduct(productId))
      }
    >
      Delete Product
    </button>
  );
};

export default DeleteProductBtn;
