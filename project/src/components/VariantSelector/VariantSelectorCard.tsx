"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductProps } from "../ProductCard/ProductCard";
import { Variant } from "@prisma/client";
import AddToCartBtn from "@/components/AddToCartBtn/AddToCartBtn";
import incrementProductQuantityInCart from "@/app/products/[id]/actions";

const VariantSelectorCard = ({ product }: ProductProps) => {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [variantSelected, setVariantSelected] = useState(false);

  const handleSelectVariant = (color: string, size: string) => {
    const matchingVariant = product.variant.find(
      (variant) => variant.color === color && variant.size === size
    );

    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
      setVariantSelected(true);
    } else {
      setSelectedVariant(null);
      setVariantSelected(false);
    }
  };

  return (
    <div>
      <div className='flex flex-col md:flex-row justify-center'>
        <div className='card-body'>
          <Image
            src={selectedVariant ? selectedVariant.image : product.defaultImg}
            alt={product.name}
            width={400}
            height={400}
            className='rounded-lg'
          />
          <h2 className='card-title'>{product.name}</h2>
          <p className='text-balance max-w-[500px]'>{product.description}</p>
          <p>{product.price} kr</p>
          {selectedVariant ? (
            <p>Quantity: {`${selectedVariant.quantity}`}</p>
          ) : null}
          <select
            className='select select-bordered w-full max-w-xs'
            value={
              selectedVariant
                ? `${selectedVariant.color} - ${selectedVariant.size}`
                : ""
            }
            onChange={(e) => {
              const selectedVariantString = e.target.value;
              const [color, size] = selectedVariantString.split(" - ");
              handleSelectVariant(color, size);
            }}
          >
            <option value='' disabled>
              Select a variant
            </option>
            {product.variant.map((variant, index) => (
              <option key={index} value={`${variant.color} - ${variant.size}`}>
                {`${variant.color} - ${variant.size}`}
              </option>
            ))}
          </select>
          <AddToCartBtn
            productId={product.id}
            selectedVariant={selectedVariant!}
            incrementProductQuantityInCart={incrementProductQuantityInCart}
            disabled={!variantSelected}
          />
        </div>
      </div>
    </div>
  );
};

export default VariantSelectorCard;
