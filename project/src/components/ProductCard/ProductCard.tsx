import Link from "next/link";
import Image from "next/image";

import { Product, Variant } from "@prisma/client";

interface ProductCardProps {
  product: Product & { variant: Variant[] };
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link href={"/products/" + product.id}>
      <Image
        src={product.defaultImg}
        alt={product.name}
        width={800}
        height={400}
        className='h-48 object-cover'
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
