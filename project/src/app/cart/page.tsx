import { getCart } from "@/actions/cartActions";
import ProductInCartCard from "./ProductInCartCard";
import CheckoutBtn from "./CheckoutBtn";

const CartPage = async () => {
  const cart = await getCart();

  return (
    <div className='flex flex-row md:flex-row'>
      <div>
        <h1 className='font-bold mb-6 text-3xl'>Shopping Cart</h1>
        {cart?.items.map((cartItem) => (
          <ProductInCartCard cartItem={cartItem} key={cartItem.id} />
        ))}
      </div>
      <div>
        <p>Att betala: {cart?.totalPrice} kr</p>
        <CheckoutBtn cart={cart} />
      </div>
    </div>
  );
};

export default CartPage;
