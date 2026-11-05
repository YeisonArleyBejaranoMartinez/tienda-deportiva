"use server"
import prisma from "@/src/lib/prisma";
import { sortVariants } from "@/src/app/utils/sortVariants";

export const getProductBySlug = async(slug: string) => {
    try{
        const product = await prisma.product.findFirst({
            include:{
                ProductImage: true,
                variants: {
                    select: { size: true, stock: true },
                          },
            },
            where:{
                slug: slug,
            }
        });
        if(!product) return null;
        return {
            ...product,
            images: product.ProductImage.map(image => image.url),
            variants: sortVariants(product.variants),
        }
    } catch(error){
        console.log(error);
        throw new Error("Error al obtener el producto");
    }
}