"use client";

import { ShoppingCart } from "@/actions/actions";
import Link from "next/link";
import { HiOutlineShoppingCart } from "react-icons/hi";

interface ShoppingCartButtonProps {
  cart: ShoppingCart | null;
}

const ShoppingCartBtn = ({ cart }: ShoppingCartButtonProps) => {
  const closeDropdown = () => {
    const elem = document.activeElement as HTMLElement;
    if (elem) {
      elem.blur();
    }
  };

  return (
    <div className='dropdown dropdown-end'>
      <label tabIndex={0} className='btn btn-ghost btn-circle'>
        <div className='indicator'>
          <HiOutlineShoppingCart className='h-5 w-5' />
          <span className='badge badge-sm indicator-item'>
            {cart?.size || 0}
          </span>
        </div>
      </label>
      <div
        tabIndex={0}
        className='card dropdown-content card-compact mt-3 w-52 bg-base-100 shadow z-30'
      >
        <div className='card-body'>
          <span className='text-lg font-bold '>
            Produkter i varukorgen: {cart?.size || 0}
          </span>
          <span className=''>Total summa: {cart?.totalPrice || 0} kr</span>
          <div className='cart-actions'>
            <Link
              href={"/cart"}
              className='btn btn-primary btn-block'
              onClick={closeDropdown}
            >
              Gå till varukorg
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartBtn;
