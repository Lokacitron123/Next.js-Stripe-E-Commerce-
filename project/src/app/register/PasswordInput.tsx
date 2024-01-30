import React, { useState } from "react";

const PasswordInput = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='relative'>
      <input
        className='input input-bordered w-full max-w-xs'
        type={showPassword ? "text" : "password"}
        name='password'
        required
        placeholder='Password...'
      />
      <span
        className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer'
        onClick={togglePasswordVisibility}
      >
        {showPassword ? (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        ) : (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
            />
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 12a3 3 0 116 0 3 3 0 01-6 0z'
            />
          </svg>
        )}
      </span>
    </div>
  );
};

export default PasswordInput;
