import { getCart } from "@/actions/actions";
import ProductInCartCard from "./ProductInCartCard";

const CartPage = async () => {
  const cart = await getCart();

  return (
    <div>
      <h1 className='font-bold mb-6 text-3xl'>Shopping Cart</h1>
      {cart?.items.map((cartItem) => (
        <ProductInCartCard cartItem={cartItem} key={cartItem.id} />
      ))}
    </div>
  );
};

export default CartPage;
