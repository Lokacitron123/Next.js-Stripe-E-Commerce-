"use client";

import { useFormStatus } from "react-dom";

const initialState = {
  boolean: false,
};

const RegisterUserBtn = () => {
  const { pending } = useFormStatus();

  return (
    <>
      <button className='btn btn-neutral w-fit mt-2'>
        {pending ? (
          <span className='loading loading-dots loading-lg'></span>
        ) : (
          "Register user"
        )}
      </button>
    </>
  );
};

export default RegisterUserBtn;
