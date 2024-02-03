"use client";
import { Product, Variant } from "@prisma/client";
import { useState } from "react";

type VariantFormProps = {
  product: Product & { variant: Variant[] };
  updateVariantFunction: (data: DataProps) => void;
};

type DataProps = {
  product: Product & { variant: Variant[] };
  newVariant: NewVariantProps;
};

export type NewVariantProps = {
  image: string;
  color: string;
  size: string;
  quantity: number;
};

// Define the VariantForm component for adding a new variant
const VariantForm = ({ product, updateVariantFunction }: VariantFormProps) => {
  // Define state to manage the new variant details
  const [newVariant, setNewVariant] = useState<NewVariantProps>({
    image: "",
    color: "",
    size: "",
    quantity: 0,
  });

  // Function to handle input change events for text fields
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setNewVariant((prevVariant) => ({
      ...prevVariant,
      [name]: value,
    }));
  };

  // Function to handle input change events for select fields
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;

    setNewVariant((prevVariant) => ({
      ...prevVariant,
      [name]: value,
    }));
  };

  // Function to handle input change events for quantity field
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const parsedValue = parseInt(value, 10);

    // Check if the parsed value is a valid number
    if (!isNaN(parsedValue)) {
      // Update the newVariant state by replacing the previous variant with a new one
      // where the specified name property (e.g., quantity) is set to the parsedValue
      setNewVariant((prevVariant) => ({
        ...prevVariant,
        [name]: parsedValue,
      }));
    }
  };

  // Function to handle form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const {
      id,
      description,
      name,
      price,
      genderCategory,
      productCategory,
      defaultImg,
      createdAt,
      updatedAt,
      variant,
    } = product;

    const productData = {
      id,
      description,
      name,
      price,
      genderCategory,
      productCategory,
      defaultImg,
      createdAt,
      updatedAt,
      variant,
    };

    const data = {
      product: productData,
      newVariant,
    };

    // Call the updateVariantFunction to update variant information
    updateVariantFunction(data);
  };

  return (
    <div>
      <form className='flex flex-col' onSubmit={handleSubmit}>
        {/* Input for Image URL */}
        <label htmlFor='image' className='label'>
          Input an image URL
        </label>
        <input
          required
          name='image'
          type='url'
          placeholder='Variant image url...'
          className='mb-3 input input-bordered w-full max-w-xs'
          value={newVariant.image}
          onChange={handleInputChange}
        />

        {/* Select for Size */}
        <label htmlFor='size' className='label'>
          Choose a size
        </label>
        <select
          className='select select-bordered w-full max-w-xs mb-3'
          required
          name='size'
          value={newVariant.size}
          onChange={handleSelectChange}
        >
          <option disabled value=''>
            Select Size
          </option>
          <option value='Small'>Small</option>
          <option value='Medium'>Medium</option>
          <option value='Extra Large'>Extra Large</option>
        </select>

        {/* Select for Color */}
        <label htmlFor='color' className='label'>
          Choose a color
        </label>
        <select
          className='select select-bordered w-full max-w-xs mb-3'
          required
          name='color'
          value={newVariant.color}
          onChange={handleSelectChange}
        >
          <option value=''>Select Color</option>
          <option>White</option>
          <option>Red</option>
          <option>Yellow</option>
          <option>Green</option>
          <option>Black</option>
          <option>Blue</option>
          <option>Purple</option>
          <option>White</option>
          <option>Orange</option>
        </select>

        {/* Input for Quantity */}
        <label htmlFor='quantity' className='label'>
          Type in quantity of product variant
        </label>
        <input
          required
          name='quantity'
          type='number'
          placeholder='Quantity...'
          className='mb-3 input input-bordered w-full max-w-xs'
          value={newVariant.quantity}
          onChange={handleQuantityChange}
        />

        {/* Submit button */}
        <button type='submit' className='btn btn-primary w-fit'>
          Add Variant
        </button>
        <div className='divider w-fit' />
      </form>
    </div>
  );
};

export default VariantForm;
