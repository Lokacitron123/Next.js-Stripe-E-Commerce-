import ProductCard from "@/components/ProductCard/ProductCard";
import prisma from "@/utils/db/prisma";

interface SearchProps {
  searchParams: { query: string };
}

// Retrieves the searchParams from url
// Tries to find matching search results based on name or description
const SearchPage = async ({ searchParams: { query } }: SearchProps) => {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    include: {
      variant: true,
      review: true,
    },
    orderBy: { id: "desc" },
  });

  if (products.length === 0) {
    return (
      <div className='text-center'>Could not find any matching products</div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
      {products.map((product) => (
        <ProductCard product={product} key={product.id} />
      ))}
    </div>
  );
};

export default SearchPage;
