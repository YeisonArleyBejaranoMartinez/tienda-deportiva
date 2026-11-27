"use server";
import prisma from "@/src/lib/prisma";
import type { Product } from "@/src/interfaces";

export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const products = await prisma.product.findMany({
      where: { featured: true },
      include: {
        ProductImage: { take: 1 },
        category: { select: { name: true } },
      },
      orderBy: { category: { name: "asc" } },
      take: 12,
    });

    return products.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      price: p.price,
      originalPrice: p.originalPrice,
      featured: p.featured,
      slug: p.slug,
      tags: p.tags,
      gender: p.gender,
      images: p.ProductImage.map((img) => img.url),
      variants: [],
      category: p.category.name,
    }));
  } catch {
    return [];
  }
};
