"use server";
import prisma from "@/src/lib/prisma";

// Stock total del producto (suma de todas sus tallas)
export const getStockBySlug = async (slug: string): Promise<number> => {
  try {
    const { _sum } = await prisma.productVariant.aggregate({
      where: { product: { slug } },
      _sum: { stock: true },
    });
    return _sum.stock ?? 0;
  } catch (error) {
    console.log(error);
    return 0;
  }
};
