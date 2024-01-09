"use client";

import Image from "next/image";
import { CartItemWithProduct } from "@/actions/actions";

interface CartEntryProps {
  cartItem: CartItemWithProduct;
}

const ProductInCartCard = ({
  cartItem: { product, quantity },
}: CartEntryProps) => {
  return (
    <div>
      <div className='flex flex-wrap items-center gap-3'>
        <Image src={product.defaultImg} alt={"Product image"} />
      </div>
      <div className='divider' />
    </div>
  );
};

export default ProductInCartCard;
