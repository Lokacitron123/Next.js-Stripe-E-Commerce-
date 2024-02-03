"use server";
import prisma from "@/utils/db/prisma";
import { Product, Variant } from "@prisma/client";
import { NewVariantProps } from "./VariantForm";

// Define the structure of the updateVariantFunctionProps type
// This type includes a product and details of a new variant
type updateVariantFunctionProps = {
  product: Product & { variant: Variant[] };
  newVariant: NewVariantProps;
};

const updateVariantFunction = async ({
  newVariant,
  product,
}: updateVariantFunctionProps) => {
  // Retrieve the existing product from the database based on the provided product ID
  const existingProduct = await prisma.product.findUnique({
    where: {
      id: product.id,
    },
    include: {
      variant: true, // Include variant details of the product
    },
  });

  // Throw an error if the product with the provided ID is not found
  if (!existingProduct) {
    throw new Error("Product with that ID not found");
  }

  // Create a new variant for the product in the database
  await prisma.variant.create({
    data: {
      image: newVariant.image,
      color: newVariant.color,
      size: newVariant.size,
      quantity: newVariant.quantity,
      Product: {
        connect: {
          id: existingProduct.id, // Connect the new variant to the existing product
        },
      },
    },
  });
};

export default updateVariantFunction;
