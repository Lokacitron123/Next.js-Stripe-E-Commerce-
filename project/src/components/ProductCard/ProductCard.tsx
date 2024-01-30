import Link from "next/link";
import Image from "next/image";

import { Product, Variant, Review } from "@prisma/client";

export interface ProductProps {
  product: Product & { variant: Variant[]; review: Review[] };
}

const ProductCard = ({ product }: ProductProps) => {
  // Calculate average rating and round to nearest even number
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
    <Link href={"/products/" + product.id}>
      <div className='card-body'>
        <Image
          src={product.defaultImg}
          alt={product.name}
          width={500}
          height={500}
          className='rounded-lg'
        />
        <h2 className='card-title'>{product.name}</h2>
        <p>
          Avrage rating: {avarageRating()}{" "}
          <span>({product.review.length})</span>
        </p>

        <p>{product.price} kr</p>
      </div>
    </Link>
  );
};

export default ProductCard;
