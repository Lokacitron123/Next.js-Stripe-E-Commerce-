"use client";

import { FaRegTrashCan } from "react-icons/fa6";
import Image from "next/image";
import { CartItemWithProduct } from "@/actions/cartActions";
import {
  incrementSelectedVariantInCart,
  decreaseSelectedVariantInCart,
  deleteProductInCart,
} from "./action";
import { useState, useTransition, useEffect } from "react";

interface CartProps {
  cartItem: CartItemWithProduct;
}

const ProductInCartCard = ({
  cartItem: { product, selectedVariant, quantity },
}: CartProps) => {
  const [isPending, startTransition] = useTransition();
  const [localQuantity, setLocalQuantity] = useState(quantity);

  useEffect(() => {
    // This useEffect is needed for localQuantity to be updated correctly
    // we set a local quantity state so we can disable the buttom from trying to set quantity to less than 1.
    // If a user wants to remove the product from cart, they have to press the delete button
    setLocalQuantity(quantity);
  }, [quantity]);

  return (
    <div className='m-w-1/2 flex flex-col md:flex-row'>
      <div className='card w-96 bg-base-100 shadow-xl'>
        <figure className='px-10 pt-10'>
          <Image
            src={selectedVariant.image}
            height={400}
            width={400}
            className='rounded-xl'
            alt={`${product.name} ${selectedVariant.color}`}
          />
        </figure>
        <div className='card-body items-center text-center'>
          <h3 className='text-xs'>{product.genderCategory}</h3>
          <h2 className='text-sm'>{product.name}</h2>
          <p>
            {selectedVariant.size} <span className='divider-vertical' />
            {selectedVariant.color}
          </p>
          <p>Amount: {quantity}</p>
          <p>Price: {quantity * product.price} kr</p>
        </div>
      </div>
      <div className='flex justify-center items-center flex-col'>
        <div>
          <button
            className='btn'
            onClick={() => {
              startTransition(async () => {
                await deleteProductInCart(product.id, selectedVariant);
              });
            }}
          >
            <FaRegTrashCan />
          </button>
        </div>
        <div className=''>
          <button
            className='text-7xl m-4'
            onClick={() => {
              startTransition(async () => {
                await incrementSelectedVariantInCart(
                  product.id,
                  selectedVariant
                );
              });
            }}
          >
            +
          </button>

          {localQuantity > 1 ? (
            <button
              className='text-7xl'
              onClick={() => {
                startTransition(async () => {
                  await decreaseSelectedVariantInCart(
                    product.id,
                    selectedVariant
                  );
                });
              }}
            >
              -
            </button>
          ) : (
            <button
              disabled={true}
              className='text-7xl text-gray-500 cursor'
              onClick={() => {
                startTransition(async () => {
                  await decreaseSelectedVariantInCart(
                    product.id,
                    selectedVariant
                  );
                });
              }}
            >
              -
            </button>
          )}

          {isPending && <span className='loading loading-dots loading-sm' />}
        </div>
      </div>

      <div className='divider' />
    </div>
  );
};

export default ProductInCartCard;
