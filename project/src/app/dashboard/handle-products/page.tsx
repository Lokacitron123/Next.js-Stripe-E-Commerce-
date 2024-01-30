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
    <>
      <div className='p-5 h-screen '>
        <h1 className='text-xl mb-2'>Products in catalog</h1>

        <div className='overflow-auto rounded-lg shadow hidden md:block'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b-2 border-gray-200'>
              <tr>
                <th className='p-3 text-sm font-semibold tracking-wide text-left'>
                  Image
                </th>
                <th className='p-3 text-sm font-semibold tracking-wide text-left'>
                  Name
                </th>
                <th className='p-3 text-sm font-semibold tracking-wide text-left'>
                  Price
                </th>
                <th className='p-3 text-sm font-semibold tracking-wide text-left'>
                  Gender Category
                </th>
                <th className='p-3 text-sm font-semibold tracking-wide text-left'>
                  Product Category
                </th>
                <th className='p-3 text-sm font-semibold tracking-wide text-left'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {products.map((product) => (
                <tr className='bg-slate-200' key={product.id}>
                  <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>
                    <Image
                      src={product.defaultImg}
                      alt={product.name}
                      width={50}
                      height={50}
                      className='w-12 h-12'
                    />
                  </td>
                  <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>
                    {product.name}
                  </td>
                  <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>
                    {product.price} kr
                  </td>
                  <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>
                    {product.genderCategory}
                  </td>
                  <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>
                    {product.productCategory}
                  </td>
                  <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>
                    <div className='flex gap-2'>
                      <Link
                        className='btn btn-primary w-fit'
                        href={"/dashboard/handle-products/" + product.id}
                      >
                        Edit Product
                      </Link>

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

        <div className='md:hidden'>
          {products.map((product) => (
            <div
              key={product.id}
              className='mb-4 bg-gray-50 p-4 rounded-lg shadow'
            >
              <div className='flex justify-between items-center mb-2'>
                <h2 className='text-sm font-semibold'>{product.name}</h2>
              </div>
              <div>
                <div className='flex items-center mb-2'>
                  <span className='font-semibold mr-2'>Image:</span>
                  <Image
                    src={product.defaultImg}
                    alt={product.name}
                    width={50}
                    height={50}
                  />
                </div>
                <div className='flex items-center mb-2'>
                  <span className='font-semibold mr-2'>Price:</span>
                  <span>{product.price} kr</span>
                </div>
                <div className='flex items-center mb-2'>
                  <span className='font-semibold mr-2'>Gender Category:</span>
                  <span>{product.genderCategory}</span>
                </div>
                <div className='flex items-center mb-2'>
                  <span className='font-semibold mr-2'>Product Category:</span>
                  <span>{product.productCategory}</span>
                </div>
              </div>
              <div className='flex gap-2'>
                <Link
                  className='btn btn-primary'
                  href={"/dashboard/handle-products/" + product.id}
                >
                  Edit Product
                </Link>
                <DeleteProductBtn
                  productId={product.id}
                  deleteProduct={deleteProduct}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HandleProductsPage;
