import ProductCard from "@/components/ProductCard/ProductCard";
import prisma from "@/utils/db/prisma";

const ProductsPage = async () => {
  const products = await prisma.product.findMany({
    where: {
      genderCategory: "Man",
    },
    orderBy: { id: "desc" },
    include: {
      variant: true,
      review: true,
    },
  });

  return (
    <div className='flex flex-col items-center'>
      <div className='my-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
        {products.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
