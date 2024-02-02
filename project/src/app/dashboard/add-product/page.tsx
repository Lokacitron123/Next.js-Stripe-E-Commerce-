import { Metadata } from "next";
import prisma from "@/utils/db/prisma";
import { redirect } from "next/navigation";

// Metadata for this page
export const metadata: Metadata = {
  title: "Johans E-Shop",
  description: "Get going!",
};

// Server actions and forms
// Documentation: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations

// server function declared in a server component
// accepts formData object from "action" on the form
export const addProduct = async (formData: FormData) => {
  "use server";

  // Retrieves data from formData with .get
  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const defaultImage = formData.get("defaultImage")?.toString() ?? "";
  const price = Number(formData.get("price") || 0);
  const genderCategory = formData.get("genderCategory")?.toString() ?? "";
  const productCategory = formData.get("productCategory")?.toString() ?? "";
  const image = formData.get("image")?.toString() ?? "";
  const size = formData.get("size")?.toString();
  const color = formData.get("color")?.toString();
  const quantity = Number(formData.get("quantity") || 0);

  if (!name || !description || !defaultImage || !price || !size || !color) {
    throw Error("Required fields are missing");
  }

  const existingProduct = await prisma.product.findFirst({
    where: {
      name: name,
    },
  });

  if (existingProduct) {
    throw Error("Product with the same name already exists");
  }

  await prisma.product.create({
    data: {
      name: name,
      description: description,
      defaultImg: defaultImage,
      price: price,
      genderCategory: genderCategory,
      productCategory: productCategory,
      variant: {
        create: {
          image: image,
          color: color,
          size: size,
          quantity: quantity,
        },
      },
    },
  });

  redirect("/products");
};

const AddProductPage = () => {
  return (
    <div className='flex  items-center flex-col  '>
      <h1 className='text-lg mb-3 font-bold'>Add Product</h1>
      <form className='flex flex-col' action={addProduct}>
        <label htmlFor='name' className='label'>
          Write a product name
        </label>
        <input
          required
          name='name'
          placeholder='Product name...'
          className='mb-3 input input-bordered w-full max-w-xs'
        />
        <label htmlFor='description' className='label'>
          Write a product description
        </label>
        <textarea
          required
          name='description'
          className='textarea textarea-bordered mb-3 w-full max-w-xs '
          placeholder='Product description'
        />
        <label htmlFor='image' className='label'>
          Input a image URL for default image
        </label>
        <input
          required
          name='defaultImage'
          type='url'
          placeholder='Default product image url...'
          className='mb-3 input input-bordered w-full max-w-xs'
        />
        <label htmlFor='image' className='label'>
          Input a image URL
        </label>
        <input
          required
          name='image'
          type='url'
          placeholder='Variant image url...'
          className='mb-3 input input-bordered w-full max-w-xs'
        />
        <label htmlFor='size' className='label'>
          Choose a size
        </label>
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

        <label htmlFor='color' className='label'>
          Choose a color
        </label>
        <select
          className='select select-bordered w-full max-w-xs mb-3'
          required
          name='color'
        >
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

        <label htmlFor='genderCategory' className='label'>
          Choose a gender category
        </label>
        <select
          className='select select-bordered w-full max-w-xs mb-3'
          required
          name='genderCategory'
        >
          <option value='Woman'>Woman</option>
          <option value='Man'>Man</option>
        </select>

        <label htmlFor='productCategory' className='label'>
          Choose a category
        </label>
        <select
          className='select select-bordered w-full max-w-xs mb-3'
          required
          name='productCategory'
        >
          <option>Shoe</option>
          <option>T-shirt</option>
          <option>Shorts</option>
          <option>Hoodie</option>
        </select>

        <label htmlFor='price' className='label'>
          Type a price
        </label>
        <input
          required
          name='price'
          type='number'
          placeholder='Product price...'
          className='mb-3 input input-bordered w-full max-w-xs'
        />
        <label htmlFor='quantity' className='label'>
          Type in quantity of product variant
        </label>
        <input
          required
          name='quantity'
          type='number'
          placeholder='Quantity...'
          className='mb-3 input input-bordered w-full max-w-xs'
        />
        <button className='btn btn-neutral w-fit '>Add product</button>
      </form>
    </div>
  );
};

export default AddProductPage;
