"use client";

import Image from "next/image";
import { HiUser } from "react-icons/hi";
import placeholderProfile from "@/assets/profile-pic-placeholder.png";
import { signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const UserBtn = () => {
  const [slideInForm, setSlideInForm] = useState(false);

  const user = useSession();

  const handleSlideIn = () => {
    setSlideInForm(true);
  };

  const closeSlideInForm = () => {
    setSlideInForm(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Check if the click is outside the slide-in form and the user button
      if (
        slideInForm &&
        !target.closest(".dropdown") &&
        !target.closest(".slide-in-form")
      ) {
        closeSlideInForm();
      }
    };

    // Attach the click event listener when the slideInForm is open
    if (slideInForm) {
      document.addEventListener("click", handleOutsideClick);
    }

    // Cleanup: remove event listener when unmounting or slideInForm closes
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [slideInForm]);

  const closeDropdown = () => {
    const elem = document.activeElement as HTMLElement;
    if (elem) {
      elem.blur();
    }
  };

  return (
    <>
      <div className='dropdown dropdown-end'>
        <label tabIndex={0} className='btn btn-ghost btn-circle'>
          {user.status === "authenticated" ? (
            <Image
              src={user.data.user?.image || placeholderProfile}
              alt='User profile image'
              width={40}
              height={40}
              className='w-10 rounded-full'
            />
          ) : (
            <HiUser />
          )}
        </label>

        <ul
          tabIndex={0}
          className='dropdown-content menu rounded-box menu-sm z-30 mt-3 w-52 bg-slate-400 p-2 gap-3'
        >
          {user.status === "authenticated" ? (
            <>
              <p className='text-black text-center font-bold'>
                {user.data.user.email}
              </p>
              <li>
                <Link
                  href={"/userdashboard"}
                  onClick={closeDropdown}
                  className='btn'
                >
                  User settings
                </Link>
              </li>
              <li>
                <Link
                  href={"/dashboard"}
                  onClick={closeDropdown}
                  className='btn'
                >
                  Admin dashboard
                </Link>
              </li>
              <li>
                <button
                  className='btn btn-secondary btn-block'
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Log out
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <button
                  className='btn btn-primary btn-block'
                  onClick={handleSlideIn}
                >
                  Log in
                </button>
              </li>
              <li>
                <button className='btn btn-secondary'>
                  <Link href={"/register"}>Register new user</Link>
                </button>
              </li>
            </>
          )}
        </ul>
      </div>

      {slideInForm && (
        <div className='fixed inset-0 z-50 bg-black bg-opacity-50'>
          <div className='absolute top-0 right-0 h-full bg-slate-500 w-80  '>
            <div className='w-full p-4 flex justify-end'>
              <button className='btn btn-circle' onClick={closeSlideInForm}>
                X
              </button>
            </div>
            <ul className='menu bg-base-200 w-56 rounded-box m-auto'>
              <li>
                <button onClick={() => signIn()}>Logga in med Google</button>
              </li>
              <li>
                <Link href='/login'>Logga in med credentials</Link>
              </li>
              <li></li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default UserBtn;
