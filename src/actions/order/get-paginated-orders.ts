"use server";
import prisma from "@/src/lib/prisma";
import { auth } from "@/src/auth.config";

export const getPaginatedOrders = async () => {
  const session = await auth();
  if (session?.user.role !== "admin") {
    return {
      ok: false,
      message: "debe de estar autenticado como admin",
    };
  }

  const orders = await prisma.order.findMany({
    orderBy: {
        createdAt: "desc",
    },
    include: {
      OrderAddress: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
  return {
    ok: true,
    orders: orders,
    message: "ordenes obtenidas exitosamente",
  };
};
