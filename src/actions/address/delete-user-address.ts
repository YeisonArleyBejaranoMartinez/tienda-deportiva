"use server";
import prisma from "@/src/lib/prisma";
export const deleteUserAddress = async (userId: string) => {
  try {
    await prisma.userAddress.delete({
      where: { userId },
    });
    return { ok: true };
  } catch (error) {
    console.log(error);
    return { ok: false };
  }
};
