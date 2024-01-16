import { redirect } from "next/navigation";
import Link from "next/link";
import ShoppingCartBtn from "./ShoppingCartBtn";
import { getCart } from "@/actions/cartActions";
import UserBtn from "./UserBtn";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const searchProducts = async (formData: FormData) => {
  "use server";

  const searchQuery = formData.get("searchQuery")?.toString();

  if (searchQuery) {
    redirect("/search?query=" + searchQuery);
  }
};

const Header = async () => {
  const session = await getServerSession(authOptions);
  const cart = await getCart();

  return (
    <header className='bg-base-100'>
      <nav className='navbar max-w-7xl m-auto flex-col sm:flex-row gap-2'>
        <div className=' '>
          <Link href={"/"} className='font-bold btn btn-ghost text-xl'>
            E-SHOP LOGO
          </Link>
        </div>

        <ul className='flex-none gap-2'>
          <Link href={"/products"}>Produkter</Link>
        </ul>

        <form action={searchProducts}>
          <div className='form-control'>
            <input
              name='searchQuery'
              placeholder='sök'
              className='input input-bordered w-full min-w-[200px]'
            />
          </div>
        </form>

        <ShoppingCartBtn cart={cart} />
        <UserBtn session={session} />
      </nav>
    </header>
  );
};

export default Header;
