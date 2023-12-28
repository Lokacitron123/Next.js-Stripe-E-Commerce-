import { Metadata } from "next";
import prisma from "@/utils/db/prisma";
import { redirect } from "next/navigation";

// Metadata for this page
export const metadata: Metadata = {
  title: "Gladiators Apparel",
  description: "Are you not entertained?",
};

// Server action
const addProduct = async (formData: FormData) => {
  "use server";

  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const imageUrl = formData.get("image")?.toString();
  const price = Number(formData.get("price") || 0);
  const size = formData.get("size")?.toString();
  const color = formData.get("color")?.toString();

  if (!name || !description || !imageUrl || !price || !size || !color) {
    throw Error("Required fields are missing");
  }

  const existingProduct = await prisma.product.findFirst({
    where: {
      name,
    },
  });

  if (existingProduct) {
    throw Error("Product with the same name already exists");
  }

  await prisma.product.create({
    data: {
      name,
      description,
      imageUrl,
      price,
      sizes: [size], // Adding the new size to the sizes array
      colors: [color], // Adding the new color to the colors array
    },
  });

  redirect("/");
};
const AddProductPage = () => {
  return (
    <div className='flex  items-center flex-col  '>
      <h1 className='text-lg mb-3 font-bold'>Add Product</h1>
      <form className='flex flex-col' action={addProduct}>
        <input
          required
          name='name'
          placeholder='Product name...'
          className='mb-3 input input-bordered w-full max-w-xs'
        />
        <textarea
          required
          name='description'
          className='textarea textarea-bordered mb-3 w-full max-w-xs'
          placeholder='Product description'
        />
        <input
          required
          name='image'
          type='url'
          placeholder='Image url...'
          className='mb-3 input input-bordered w-full max-w-xs'
        />

        <select
          className='select select-bordered w-full max-w-xs mb-3'
          required
          name='size'
        >
          <option disabled defaultValue={"Select Size"}>
            Select Size
          </option>
          <option>Small</option>
          <option>Medium</option>
          <option>Extra Large</option>
        </select>

        <select
          className='select select-bordered w-full max-w-xs mb-3'
          required
          name='color'
        >
          <option disabled defaultValue={" Select Color"}>
            Select Color
          </option>
          <option>Red</option>
          <option>Yellow</option>
          <option>Green</option>
          <option>Black</option>
          <option>Blue</option>
          <option>Purple</option>
          <option>White</option>
          <option>Orange</option>
        </select>

        <input
          required
          name='price'
          type='number'
          placeholder='Product price...'
          className='mb-3 input input-bordered w-full max-w-xs'
        />
        <button className='btn btn-neutral w-fit '>Add product</button>
      </form>
    </div>
  );
};

export default AddProductPage;
