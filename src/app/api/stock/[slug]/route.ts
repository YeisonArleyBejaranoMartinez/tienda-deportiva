import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

export async function GET(
  _: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;

  const stock = await prisma.product.findFirst({
    where: { slug },
    select: { inStock: true },
  });

  return NextResponse.json({ stock: stock?.inStock ?? 0 });
}
