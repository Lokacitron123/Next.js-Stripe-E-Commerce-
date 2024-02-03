"use client";

import { Product, Variant } from "@prisma/client";
import { useState, ReactNode } from "react";
import updateVariantFunction from "./action";
import VariantForm from "./VariantForm";

type ProductProps = {
  product: Product & { variant: Variant[] };
};

const AddVariant = ({ product }: ProductProps) => {
  const [variantForms, setVariantForms] = useState<ReactNode[]>([]);

  // Function to add a new variant form
  const addVariantForm = () => {
    // Add a new variant form to the state
    setVariantForms([
      ...variantForms,
      <VariantForm
        key={variantForms.length}
        product={product}
        updateVariantFunction={updateVariantFunction}
      />,
    ]);
  };

  return (
    <div>
      <div>
        <button className='btn btn-secondary' onClick={addVariantForm}>
          New Variant
        </button>
      </div>
      <div>
        {variantForms.map((_, index) => (
          <VariantForm
            key={index}
            product={product}
            updateVariantFunction={updateVariantFunction}
          />
        ))}
      </div>
    </div>
  );
};

export default AddVariant;
