import { redirect } from "next/navigation";
import Link from "next/link";
import ShoppingCartBtn from "./ShoppingCartBtn";
import { getCart } from "@/actions/cartActions";
import UserBtn from "./UserBtn";
import Links from "./Links";

// Adds search functionality
const searchProducts = async (formData: FormData) => {
  "use server";

  const searchQuery = formData.get("searchQuery")?.toString();

  // Adds the searchQuery to the url and redirected to the search page where the query is used
  if (searchQuery) {
    redirect("/search?query=" + searchQuery);
  }
};

const Header = async () => {
  const cart = await getCart();

  return (
    <header className='bg-base-100 '>
      <nav className='mt-5 m-auto max-w-7xl flex justify-between items-center flex-col mb-3 sm:flex-row gap-3'>
        <div className=' '>
          <Link href={"/"} className='font-bold btn btn-ghost text-xl'>
            Johans E-SHOP
          </Link>
        </div>

        <form action={searchProducts}>
          <div className='form-control'>
            <input
              name='searchQuery'
              placeholder='sök'
              className='input input-bordered w-full min-w-[200px]'
            />
          </div>
        </form>
        <div className='flex min-w-[200px] gap-3 items-center justify-between '>
          <ShoppingCartBtn cart={cart} />
          <UserBtn />
        </div>
      </nav>
      <Links />
    </header>
  );
};

export default Header;
