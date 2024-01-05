"use server";

import prisma from "@/utils/db/prisma";
import { revalidatePath } from "next/cache"; // to refresh page

// Prisma delete deletes relational schema models if settings are set to Cascade in the schema file
// Documentation: https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/referential-actions

const deleteProduct = async (productId: string) => {
  try {
    await prisma.product.delete({
      where: {
        id: productId,
      },
    });
  } catch (error) {
    console.error("Error deleting product:", error);
  }

  revalidatePath("/dashboard/handle-products");
};

export default deleteProduct;
