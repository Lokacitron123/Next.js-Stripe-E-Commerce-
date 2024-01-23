import { getCart } from "@/actions/cartActions";
import ProductInCartCard from "./ProductInCartCard";
import CheckoutBtn from "./CheckoutBtn";

const CartPage = async () => {
  const cart = await getCart();

  return (
    <>
      <div className='flex items-center flex-col mb-6'>
        <h1 className='font-bold mb-3 text-3xl'>Your cart</h1>
        <p>Items in cart: {cart?.size}</p>
        {!cart?.items.length ? (
          <p className='m-auto mt-10'>Your cart is empty</p>
        ) : (
          <>
            <div className='flex items-center flex-col'>
              {cart?.items.map((cartItem) => (
                <ProductInCartCard cartItem={cartItem} key={cartItem.id} />
              ))}
            </div>
            <div>
              <p>Att betala: {cart?.totalPrice} kr</p>
              <CheckoutBtn cart={cart} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartPage;
