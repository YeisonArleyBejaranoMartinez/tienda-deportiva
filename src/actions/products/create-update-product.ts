"use server";
import {z}  from "zod";
import { Gender, Size } from "../../generated/enums";
import prisma from "@/src/lib/prisma";
import { Product } from "@/src/generated/client";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config(process.env.CLOUDINARY_URL ?? "");

const productShema = z.object({
    id: z.string().uuid().optional().nullable(),
    title: z.string().min(3).max(255),
    slug: z.string().min(3).max(255),
    description: z.string().max(2550),
    price: z.coerce.number().min(0).transform(val=>Number(val.toFixed(2))),
    inStock: z.coerce.number().min(0).transform(val=>Number(val.toFixed(0))),
    categoryId: z.string().uuid(),
    sizes: z.coerce.string().transform(val=> val.split(",")),
    tags: z.string(),
    gender: z.nativeEnum(Gender)

})

export const createUpdateProduct = async (formData: FormData) => {
    const data = Object.fromEntries(formData);
    const productParsed = productShema.safeParse(data);

     if(!productParsed.success){
        // console.log("productParsed",  productParsed.error);
        return{ok: false, error: productParsed.error}
     }

    const products = productParsed.data;
    products.slug = products.slug.toLowerCase().replace(/ /g, "-").trim();
    const {id, ...rest} = products;
    try{
        let product : Product;
         const prismaTx = await prisma.$transaction( async (tx)=>{
        const tagsArray = rest.tags.split(",").map(tag => tag.trim().toLowerCase());
        if(id){
            //Actualizar
            const oldProduct = await tx.product.findUnique({ where: { id }, select: { slug: true } });
            product = await tx.product.update({
                where: {
                    id: id
                },
                data:{
                    ...rest,
                    sizes:{
                        set: rest.sizes as Size[]
                    }, tags: tagsArray
                }
            })
            if(oldProduct && oldProduct.slug !== product.slug){
                revalidatePath(`/product/${oldProduct.slug}`);
                revalidatePath(`/admin/product/${oldProduct.slug}`);
            }
        }
        else{
            //Crear
            product= await tx.product.create({
                data:{
                    ...rest,
                    sizes: {
                        set: rest.sizes as Size[]
                    },
                    tags: {
                        set: tagsArray
                    }
                }
            })
        }
       //TODO: proceso de carga y guardado de imagenes
       //Recorrer las imagenes y guardarlas
       if(formData.getAll("images")){
        //https://url.jpg
        //https:: // url.jpg
        const images =  await uploadImages(formData.getAll("images") as File[]);
        if(!images){
            throw new Error("No se puede cargar las imágenes, rollingback");
        }
        await prisma.productImage.createMany({
            data: images.filter((image): image is string => image !== null).map(image=>({
                url: image,
                productId: product.id
            }))
        })

       }
        revalidatePath("/admin/products");
        revalidatePath(`/admin/product/${product.slug}`);
        revalidatePath(`/product/${product.slug}`);
        return {product};
    })
    return {
        ok: true,
        product: prismaTx.product
    }


    }
    catch(error){
        console.log(error);
        return {
            ok: false,
            message: "Revisar los logs, no se puede actualizar"
        };
    }
}



const uploadImages =async (images: File[])  =>{
    try {
        const uploadPromises = images.map( async(image) => {
            try{
                const  buffer= await image.arrayBuffer();
                const base64Image = Buffer.from(buffer).toString("base64");
                return cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`).then((r: {secure_url: string}) => r.secure_url);
            }
            catch(error){
                console.log(error);
                return null
            }

        });
        const uploadedImages = await Promise.all(uploadPromises);
        return uploadedImages
    } catch (error) {
        console.log(error);
        return null;
    }
}