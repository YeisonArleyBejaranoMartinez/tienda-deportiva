import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { sortVariants } from "@/src/app/utils/sortVariants";

// Devuelve el stock total y el stock por talla del producto
export async function GET(
  _: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;

  const variants = await prisma.productVariant.findMany({
    where: { product: { slug } },
    select: { size: true, stock: true },
  });

  const stock = variants.reduce((total, v) => total + v.stock, 0);

  return NextResponse.json({ stock, variants: sortVariants(variants) });
}
