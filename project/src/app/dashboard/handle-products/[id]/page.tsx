import ProductCard from "@/components/ProductCard/ProductCard";
import prisma from "@/utils/db/prisma";
import { notFound } from "next/navigation";
import AddVariant from "./AddVariantField";
import BackTrackBtn from "@/components/BackTrackBtn/BackTrackBtn";

interface SingleProductProps {
  params: {
    id: string;
  };
}

const UpdateProductPage = async ({ params: { id } }: SingleProductProps) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      variant: true,
    },
  });

  if (!product) notFound();

  return (
    <>
      <div className='ml-6 '>
        <BackTrackBtn />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2'>
        <div className=''>
          <ProductCard product={product} />
        </div>

        <div className='w-full'>
          <AddVariant product={product} />
        </div>
      </div>
    </>
  );
};

export default UpdateProductPage;
