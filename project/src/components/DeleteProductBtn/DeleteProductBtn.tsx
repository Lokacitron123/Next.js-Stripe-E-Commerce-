"use client";

import { useTransition } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
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
      Delete <FaRegTrashCan />
    </button>
  );
};

export default DeleteProductBtn;
