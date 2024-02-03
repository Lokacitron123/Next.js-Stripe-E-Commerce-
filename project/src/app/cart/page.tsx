// This component represents the page displaying the user's shopping cart.
// It fetches the user's cart data, displays the cart items along with their details,
// and provides a checkout button for initiating the payment process.

// Importing necessary modules and components
import { getCart } from "@/actions/cartActions"; // Importing function to fetch cart data
import ProductInCartCard from "./ProductInCartCard"; // Importing component to render individual product cards in the cart
import CheckoutBtn from "./CheckoutBtn"; // Importing component for checkout button

// CartPage functional component
const CartPage = async () => {
  // Fetching the user's cart data
  const cart = await getCart();

  // Rendering the cart page content
  return (
    <>
      <div className='flex items-center flex-col mb-6'>
        <h1 className='font-bold mb-3 text-3xl'>Your cart</h1>
        <p>Items in cart: {cart?.size}</p>
        {/* Conditional rendering based on cart contents */}
        {!cart?.items.length ? (
          <p className='m-auto mt-10'>Your cart is empty</p>
        ) : (
          <>
            <div className='flex items-center flex-col'>
              {/* Rendering individual product cards for each item in the cart */}
              {cart?.items.map((cartItem) => (
                <ProductInCartCard cartItem={cartItem} key={cartItem.id} />
              ))}
            </div>
            <div>
              {/* Displaying the total price of items in the cart */}
              <p>Att betala: {cart?.totalPrice} kr</p>
              {/* Rendering the checkout button component */}
              <CheckoutBtn cart={cart} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartPage;
