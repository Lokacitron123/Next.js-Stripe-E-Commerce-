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

  function avarageRating() {
    // Check if there are no reviews
    if (product.review.length === 0) return <span>No rating</span>;

    // Initialize total and count variables
    var total = 0;
    var count = 0;

    // Iterate through each review and sum up the ratings
    product.review.forEach(function (review) {
      total += review.rating; // Assuming 'rating' is the property storing the rating value
      count++;
    });

    // Calculate the average rating
    var average = total / count;

    // Round down to the nearest even number
    return Math.floor(average / 2) * 2;
  }

  return (
    <div className='card-body max-w-96'>
      <Image
        src={selectedVariant ? selectedVariant.image : product.defaultImg}
        alt={product.name}
        width={400}
        height={400}
        className='rounded-lg'
      />
      <h2 className='card-title'>{product.name}</h2>
      <p>
        Avrage rating: {avarageRating()} <span>({product.review.length})</span>{" "}
      </p>
      <div className='collapse bg-base-200 '>
        <input type='checkbox' />
        <div className='collapse-title text-xl font-medium'>Desription</div>
        <div className='collapse-content'>
          <p>{product.description}</p>
        </div>
      </div>
      <p>Price: {product.price} kr</p>
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
  );
};

export default VariantSelectorCard;
