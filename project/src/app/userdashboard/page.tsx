import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/utils/db/prisma";
import { getOrders, getReviews } from "@/actions/reviewActions";
import ShowReviewBtn from "@/components/AddReviewForm/ShowReviewBtn";

const UserDashboard = async () => {
  const user = await getServerSession(authOptions);
  const userId = user?.user.id;
  const orders = await getOrders(userId);

  return (
    <>
      <div className='flex gap-2 items-center flex-col'>
        <h1 className='text-5xl'>User dashboard</h1>
        <h2>Leave a review</h2>
      </div>
      <div className='divider divider-neutral'></div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {orders.map((order) => (
          <div key={order.id} className='bg-white shadow-md rounded-md p-4'>
            <h3 className='text-lg font-semibold mb-2'>Order ID: {order.id}</h3>
            <p className='text-sm mb-2'>Total amount: {order.totalAmount}</p>
            <p className='text-sm mb-2'>status: {order.status}</p>
            <p>userID: {order.userId}</p>
            <ul>
              {order.orderedProduct.map((product) => (
                <li key={product.id} className='text-gray-700 flex flex-col'>
                  {product.name}
                  <ShowReviewBtn
                    orderId={order.orderId}
                    productName={product.name}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
};

export default UserDashboard;
