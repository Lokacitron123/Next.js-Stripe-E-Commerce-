import RegisterUser from "./RegisterUser";

const RegisterPage = () => {
  return (
    <div className='flex  items-center flex-col  '>
      <h1 className='text-lg mb-3 font-bold'>Registrera användare</h1>
      <RegisterUser />
    </div>
  );
};

export default RegisterPage;
