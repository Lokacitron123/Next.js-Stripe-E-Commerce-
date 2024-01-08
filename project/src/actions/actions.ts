import { Cart } from "@prisma/client";

export type ShoppingCart = {
  size: number;
  subtotal: number;
};

export const createCart = async() Promise<ShoppingCart> => {
    

    let newCart: Cart;

    newCart = await prisma?.cart.create({
        data: {}
    })
};
