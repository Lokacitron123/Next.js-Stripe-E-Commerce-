"use client";
import Link from "next/link";

import { FiMenu } from "react-icons/fi";
import { TfiClose } from "react-icons/tfi";
import { useState } from "react";

const Links = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // sets the menu state to the opposite of what it is at the moment
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className='flex max-w-7xl m-auto p-4 justify-between md:justify-center'>
      <div>
        <ul
          className={`md:inline-flex gap-5 ${
            isMenuOpen ? "block" : "hidden"
          } md:h-full`}
        >
          <li>
            <Link href={"/products"}>Produkter</Link>
          </li>
          <li>
            <Link href={"/products/men"}>Men</Link>
          </li>
          <li>
            <Link href={"/products/woman"}>Woman</Link>
          </li>
        </ul>
      </div>
      <div className='inline-flex md:hidden'>
        <button onClick={toggleMenu}>
          {isMenuOpen ? (
            <TfiClose className='text-3xl' />
          ) : (
            <FiMenu className='text-3xl' />
          )}
        </button>
      </div>
    </div>
  );
};

export default Links;
