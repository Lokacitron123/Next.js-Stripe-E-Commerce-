"use client";

import Image from "next/image";
import { CartItemWithProduct } from "@/actions/cartActions";

interface CartEntryProps {
  cartItem: CartItemWithProduct;
}

const ProductInCartCard = ({
  cartItem: { product, selectedVariant, quantity },
}: CartEntryProps) => {
  return (
    <div>
      <div className='flex flex-wrap items-center gap-3'>
        <Image
          src={selectedVariant?.image || product.defaultImg}
          alt={"Product image"}
          width={500}
          height={500}
          priority={true}
        />
        <p>Antal: {quantity}</p>
        <p>{selectedVariant.size}</p>
        <p>{selectedVariant.color}</p>
      </div>
      <div className='divider' />
    </div>
  );
};

export default ProductInCartCard;
