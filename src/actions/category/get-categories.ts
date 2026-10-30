"use server";

import prisma from "@/src/lib/prisma";

export const getCategories = async ()=>{
    try{
        const categories = await prisma.category.findMany(
            {
                orderBy: {
                    name: "asc"
                }
            }
        )

        return categories;
    }catch(error){
        console.log(error);
        throw new Error("Failed to fetch categories");
    }
}