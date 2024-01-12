"use client";

import { useRef, useState, FormEvent } from "react";
import { registerUser } from "@/actions/userAuthActions";

const RegisterUser = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [togglePassword, setTogglePassword] = useState<boolean>(false);

  const validateEmail = (input: string) => {
    setEmailError(
      input.includes("@") ? "" : "Felaktigt format på epostadressen."
    );
  };

  const validatePassword = (input: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    setPasswordError(passwordRegex.test(input) ? "" : "Felaktigt lösenord");
  };

  const handleToggle = () => setTogglePassword((prev) => !prev);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const newUser = {
      username: username,
      email: email,
      password: password,
    };

    console.log("Logging newUSer", newUser);
    try {
      await registerUser(newUser);
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (error) {
      console.error(error);
      // Handle errors, display messages, etc.
    }
  };

  return (
    <>
      <form ref={formRef} className='flex flex-col' onSubmit={handleSubmit}>
        <label htmlFor='username' className='label'>
          Användarnamn
        </label>
        <input
          type='text'
          name='username'
          placeholder='Ditt användarnamn...'
          className='mb-3 input input-bordered w-full max-w-xs'
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          required
        />

        <label htmlFor='email' className='label'>
          E-post
        </label>
        <input
          type='email'
          name='email'
          placeholder='Din epost...'
          className={`mb-3 input input-bordered w-full max-w-xs ${
            emailError ? "error" : ""
          }`}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            validateEmail(e.target.value);
          }}
          required
        />
        {emailError && <p className='error-message'>{emailError}</p>}

        <label htmlFor='password' className='label'>
          Lösenord
        </label>
        <div className='relative mb-3'>
          <input
            type={togglePassword ? "text" : "password"}
            name='password'
            placeholder='Lösenord...'
            className={`input input-bordered w-full max-w-xs ${
              passwordError ? "error" : ""
            }`}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              validatePassword(e.target.value);
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
        {passwordError && <p className='error-message'>{passwordError}</p>}

        <button type='submit' className='btn btn-neutral w-fit'>
          Registrera ny användare
        </button>
      </form>
    </>
  );
};

export default RegisterUser;
