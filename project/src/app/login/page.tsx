"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginPage = () => {
  const router = useRouter();
  const [togglePassword, setTogglePassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleToggle = () => setTogglePassword((prev) => !prev);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    router.push("/");
  };

  return (
    <div className='flex  items-center flex-col  '>
      <form className='flex flex-col' onSubmit={handleLogin}>
        <label htmlFor='email' className='label'>
          Logga in med epost
        </label>
        <input
          type='email'
          name='email'
          placeholder='Din epost'
          className='mb-3 input input-bordered w-full max-w-xs'
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          required
        />

        <label htmlFor='password' className='label'>
          Lösenord
        </label>
        <div className='relative mb-3'>
          <input
            type={togglePassword ? "text" : "password"}
            name='password'
            placeholder='Lösenord...'
            className='input input-bordered w-full max-w-xs '
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
          />
          <span
            className='absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer'
            onClick={() => handleToggle()}
          >
            {togglePassword ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                className='h-6 w-6 text-gray-500'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                className='h-6 w-6 text-gray-500'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                />
              </svg>
            )}
          </span>
        </div>

        <button type='submit' className='btn btn-neutral w-fit'>
          Logga in
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
