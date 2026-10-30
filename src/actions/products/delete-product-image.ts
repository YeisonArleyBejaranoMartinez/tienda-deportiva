"use server"
import prisma from "@/src/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";
export const  deleteProductImage = async(imageId: number, imageUrl: string)=>{
    if(!imageUrl.startsWith("http")){
        return{
            ok: false,
            error: "No se puede borrar imagenes de FS"
        }
    }
const imageName = imageUrl.split("/").pop()?.split(".")[0]?? "";
// console.log({"IMAGE NAME": imageName})
try{
await cloudinary.uploader.destroy(imageName);
const deletedImage = await prisma.productImage.delete({
where: {
    id: imageId
}, select:{
    product:{
        select:{
            slug: true
        }
    }
}
})
//revalidar los paths
revalidatePath(`/admin/products`)
revalidatePath(`/product/${deletedImage.product.slug}`);
revalidatePath(`/product/${deletedImage.product.slug}`);
}catch(error){
     console.log(error )
return{
    ok: false,
    message: "No se pudo eliminar la imagen"
}
}
}