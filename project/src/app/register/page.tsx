"use client";

// failed implementing formData for registering a user
// Therefor vent with a call to an api route
// Due to being more used to this way of writing code

import { useState } from "react";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const router = useRouter();
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const registerUser = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorInfo = await response.json();
        setError(errorInfo.error);

        setData({
          email: "",
          password: "",
        });

        return; // Stop execution if there's an error
      }

      const userInfo = await response.json();
      console.log(userInfo);

      // If registration is successful, navigate to the login page
      router.push("/login");
    } catch (error) {
      console.error("An error occurred:", error);
      setError("An unexpected error occurred. Please try again."); // Update the error state}
      setData({
        email: "",
        password: "",
      });
    }
  };

  return (
    <div className='flex  items-center flex-col  '>
      <h1 className='text-lg mb-3 font-bold'>Registrera användare</h1>
      {error && <p className='text-red-500'>{error}</p>}
      <form onSubmit={registerUser}>
        <label className='label' htmlFor='email'>
          Epost
        </label>
        <input
          className='input input-bordered w-full max-w-xs'
          type='email'
          name='email'
          placeholder='Din epost...'
          required
          value={data.email}
          onChange={(e) => {
            setData({ ...data, email: e.target.value });
          }}
        />

        <label className='label' htmlFor='password'>
          Lösenord
        </label>
        <input
          className='input input-bordered w-full max-w-xs'
          type='password'
          name='password'
          required
          placeholder='Lösenord...'
          value={data.password}
          onChange={(e) => {
            setData({ ...data, password: e.target.value });
          }}
        />
        <button className='btn btn-neutral w-fit mt-2'>Registrera</button>
      </form>
    </div>
  );
};

export default RegisterPage;
