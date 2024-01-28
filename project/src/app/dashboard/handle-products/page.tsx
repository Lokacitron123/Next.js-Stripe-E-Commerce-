import DeleteProductBtn from "@/components/DeleteProductBtn/DeleteProductBtn";
import deleteProduct from "@/components/DeleteProductBtn/action";
import prisma from "@/utils/db/prisma";
import Link from "next/link";
import Image from "next/image";

const HandleProductsPage = async () => {
  const products = await prisma.product.findMany({
    orderBy: { id: "desc" },
    include: {
      variant: true,
    },
  });

  return (
    <div className='overflow-x-auto'>
      <table className='table'>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Gender Category</th>
            <th>Product Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <Image
                  src={product.defaultImg}
                  alt={product.name}
                  width={50}
                  height={50}
                  className='w-12 h-12'
                />
              </td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.genderCategory}</td>
              <td>{product.productCategory}</td>
              <td>
                <div className='flex gap-2'>
                  <button className='btn btn-primary'>
                    <Link href={"/dashboard/handle-products/" + product.id}>
                      Edit
                    </Link>
                  </button>
                  <DeleteProductBtn
                    productId={product.id}
                    deleteProduct={deleteProduct}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HandleProductsPage;
