"use client";

import { registerUser } from "@/actions/userActions";
import RegisterUserBtn from "./RegisterBtn";
import { useFormState } from "react-dom";

const RegisterPage = () => {
  const [state, formAction] = useFormState(registerUser, null);

  return (
    <div className='flex  items-center flex-col  '>
      <h1 className='text-lg mb-3 font-bold'>Register new user</h1>
      {state?.success === false && ( // Render error message if success is false
        <p className='text-red-400'>{state.message}</p>
      )}
      {state?.success && ( // Render success message if success is true
        <p className='text-green-400'>{state.message}</p>
      )}
      <form action={formAction}>
        <label className='label' htmlFor='email'>
          Epost
        </label>
        <input
          className='input input-bordered w-full max-w-xs'
          type='email'
          name='email'
          placeholder='Your email...'
          required
        />

        <label className='label' htmlFor='password'>
          Password
        </label>
        <input
          className='input input-bordered w-full max-w-xs'
          type='password'
          name='password'
          required
          placeholder='Password...'
        />
        <RegisterUserBtn />
      </form>
    </div>
  );
};

export default RegisterPage;
