"use server"
import prisma from "@/src/lib/prisma";
import { sortVariants } from "@/src/app/utils/sortVariants";

export const getProductBySlug = async(slug: string) => {
    try{
        const product = await prisma.product.findFirst({
            include:{
                ProductImage: true,
                variants: { select: { size: true, stock: true } },
                category: { select: { name: true } },
            },
            where:{ slug },
        });
        if(!product) return null;
        return {
            ...product,
            images: product.ProductImage.map(image => image.url),
            variants: sortVariants(product.variants),
            category: product.category.name,
        }
    } catch(error){
        console.log(error);
        throw new Error("Error al obtener el producto");
    }
}