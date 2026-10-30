"use server"
import prisma from "@/src/lib/prisma";
export const getCountries = async ()=>{
    try {
        const countries = await prisma.country.findMany({
            orderBy: { name: "asc" },
        });
        return countries;

    } catch (error) {
        console.error(error);
        return [];
    }
}