"use client";

import { registerUser } from "./action";

const RegisterPage = () => {
  return (
    <div className='flex  items-center flex-col  '>
      <h1 className='text-lg mb-3 font-bold'>Registrera användare</h1>
      <form className='flex flex-col' action={registerUser}>
        <label htmlFor='username' className='label'>
          Användarnamn
        </label>
        <input
          type='text'
          name='username'
          placeholder='Ditt användarnamn...'
          className='mb-3 input input-bordered w-full max-w-xs'
        />

        <label htmlFor='email' className='label'>
          E-post
        </label>
        <input
          type='email'
          name='email'
          placeholder='Din epost...'
          className='mb-3 input input-bordered w-full max-w-xs'
        />

        <label htmlFor='password' className='label'>
          Lösenord
        </label>
        <input
          type='password'
          name='password'
          placeholder='Lösenord...'
          className='mb-3 input input-bordered w-full max-w-xs'
        />
        <button className='btn btn-neutral w-fit '>
          Registrera ny användare
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
