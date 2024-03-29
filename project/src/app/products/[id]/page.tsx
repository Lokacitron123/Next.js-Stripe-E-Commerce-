import prisma from "@/utils/db/prisma";
import { Metadata } from "next";

import { notFound } from "next/navigation";
import { cache } from "react";
import VariantSelectorCard from "@/components/VariantSelector/VariantSelectorCard";
import ReviewCommentCard from "@/components/ReviewCommentCard.tsx/ReviewCommentCard";

// Get id out of the URL with params
interface SingleProductProps {
  params: {
    id: string;
  };
}

// Too generate the meta data and get the product information for SingleProductPage we use the cache function from Next.js
// We use it because it would be wastefull to make two fetches inside of this page.tsx, resulting in two database operations
// By fetching inside of cache we can then return the product data and use it for both the meta data, as well inside our SingleProductPage
const getProduct = cache(async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      variant: true,
      review: true,
    },
  });

  if (!product) notFound();

  return product;
});

export const generateMetaData = async ({
  params: { id },
}: SingleProductProps): Promise<Metadata> => {
  const product = await getProduct(id);

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      images: [{ url: product.defaultImg }],
    },
  };
};

const SingleProductPage = async ({ params: { id } }: SingleProductProps) => {
  const product = await getProduct(id);

  return (
    <>
      <div className='flex justify-center  flex-col md:flex-row gap-5'>
        <VariantSelectorCard product={product} />

        <div className='flex flex-col items-center'>
          <h2 className='mt-8'>Reviews</h2>
          {product.review.map((item) => (
            <ReviewCommentCard key={item.id} review={item} />
          ))}
        </div>
      </div>
    </>
  );
};

export default SingleProductPage;
