import Link from "next/link";
import React from "react";

const AdminPanelPage = () => {
  return (
    <div>
      Hello from admin panel page
      <nav>
        <Link href={"/dashboard/add-product"}>Add product</Link>
        <Link href={"/dashboard/handle-products"}>Handle Products</Link>
      </nav>
    </div>
  );
};

export default AdminPanelPage;
