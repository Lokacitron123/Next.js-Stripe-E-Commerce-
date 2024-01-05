"use server";
import prisma from "@/utils/db/prisma";
import { Product, Variant } from "@prisma/client";
import { NewVariantProps } from "./VariantForm";

type updateVariantFunctionProps = {
  product: Product & { variant: Variant[] };
  newVariant: NewVariantProps;
};

const updateVariantFunction = async ({
  newVariant,
  product,
}: updateVariantFunctionProps) => {
  const existingProduct = await prisma.product.findUnique({
    where: {
      id: product.id,
    },
    include: {
      variant: true,
    },
  });

  if (!existingProduct) {
    throw new Error("Product with that id not found");
  }

  await prisma.variant.create({
    data: {
      image: newVariant.image,
      color: newVariant.color,
      size: newVariant.size,
      quantity: newVariant.quantity,
      Product: {
        connect: {
          id: existingProduct.id,
        },
      },
    },
  });
};

export default updateVariantFunction;
