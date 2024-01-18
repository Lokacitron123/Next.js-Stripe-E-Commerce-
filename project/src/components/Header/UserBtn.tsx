"use client";

import { Session } from "next-auth";
import Image from "next/image";
import { HiUser } from "react-icons/hi";
import placeholderProfile from "@/assets/profile-pic-placeholder.png";
import { signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface UserBtnProps {
  session: Session | null;
}

const UserBtn = () => {
  const [slideInForm, setSlideInForm] = useState(false);

  const user = useSession();
  console.log("logging session", user);

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

  return (
    <>
      <div className='dropdown dropdown-end'>
        <label tabIndex={0} className='btn btn-ghost btn-circle'>
          {user.status === "authenticated" ? (
            <Image
              src={user.data?.user?.image || placeholderProfile}
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
          className='dropdown-content menu rounded-box menu-sm z-30 mt-3 w-52 bg-blue-100 p-2'
        >
          <li>
            {user.status === "authenticated" ? (
              <button
                className='btn btn-secondary btn-block'
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Logga ut
              </button>
            ) : (
              <button
                className='btn btn-primary btn-block'
                onClick={handleSlideIn}
              >
                Logga in
              </button>
            )}
          </li>
        </ul>
      </div>

      {slideInForm && (
        <div className='fixed inset-0 z-50 bg-black bg-opacity-50'>
          <div className='absolute top-0 right-0 h-full bg-white w-80'>
            <button onClick={closeSlideInForm}>Close</button>
            <button onClick={() => signIn()}>Logga in med Google</button>
            <Link href='/login'>Logga in med credentials</Link>
          </div>
        </div>
      )}
    </>
  );
};

export default UserBtn;
