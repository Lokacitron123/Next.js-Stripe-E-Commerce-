import Link from "next/link";
import React from "react";

const AdminPanelPage = () => {
  return (
    <div className='flex flex-col justify-center items-center gap-3'>
      <h1>Admin dashboard</h1>
      <nav className='flex  gap-3'>
        <Link className='btn btn-primary' href={"/dashboard/add-product"}>
          Add product
        </Link>
        <Link className='btn btn-primary' href={"/dashboard/handle-products"}>
          Handle Products
        </Link>
      </nav>
    </div>
  );
};

export default AdminPanelPage;
