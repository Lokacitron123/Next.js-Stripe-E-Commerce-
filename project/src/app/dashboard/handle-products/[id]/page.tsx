import ProductCard from "@/components/ProductCard/ProductCard";
import prisma from "@/utils/db/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import AddVariant from "./AddVariantField";

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
    <div className='flex flex-row gap-1'>
      <div className='w-1/3'>
        <ProductCard product={product} />
      </div>

      <div className='w-full'>
        <AddVariant product={product} />
      </div>
    </div>
  );
};

export default UpdateProductPage;
