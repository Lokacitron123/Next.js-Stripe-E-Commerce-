import Link from "next/link";
import Image from "next/image";

import { Product, Variant } from "@prisma/client";

export interface ProductProps {
  product: Product & { variant: Variant[] };
}

const ProductCard = ({ product }: ProductProps) => {
  return (
    <Link href={"/products/" + product.id}>
      <Image
        src={product.defaultImg}
        alt={product.name}
        width={500}
        height={500}
        className='rounded-lg'
      />
      <div className='card-body'>
        <h2 className='card-title'>{product.name}</h2>
        <p>{product.description}</p>
        <p>{product.price} kr</p>
      </div>
    </Link>
  );
};

export default ProductCard;
