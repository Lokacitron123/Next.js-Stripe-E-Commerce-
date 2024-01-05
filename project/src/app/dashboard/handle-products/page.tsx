import DeleteProductBtn from "@/components/DeleteProductBtn/DeleteProductBtn";
import deleteProduct from "@/components/DeleteProductBtn/action";
import prisma from "@/utils/db/prisma";
import Link from "next/link";

const HandleProductsPage = async () => {
  const products = await prisma.product.findMany({
    orderBy: { id: "desc" },
    include: {
      variant: true,
    },
  });

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          <p>{product.name}</p>
          <Link href={"/dashboard/handle-products/" + product.id}>Edit</Link>
          <DeleteProductBtn
            productId={product.id}
            deleteProduct={deleteProduct}
          />
        </div>
      ))}
    </div>
  );
};

export default HandleProductsPage;
