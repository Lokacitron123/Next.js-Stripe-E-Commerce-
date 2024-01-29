"use server";

import prisma from "@/utils/db/prisma";
import { User } from "@prisma/client";

export const getUser = async (userID: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: {
      id: userID,
    },
  });

  return user;
};
