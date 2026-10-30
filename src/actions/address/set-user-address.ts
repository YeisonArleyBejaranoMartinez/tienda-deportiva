"use server"

import prisma from "@/src/lib/prisma";
import type { Address } from '../../interfaces/address.interface';

export const setUserAddress = async (address: Address , userId: string) =>{
 try {
    const newAddress = await createOrReplaceAddress(address, userId);
    return {
        ok: true,
        message: "dirección creada exitosamente",
        address: newAddress
    }
 } catch (error) {
    console.log(error);
    return {
        ok: false,
        message: "no se pudo crear la dirección"
    }
 }
}
const createOrReplaceAddress = async (address: Address, userId: string)=>{
    // console.log(userId, "userId desde la action");
try {
    const storedAddress = await prisma.userAddress.findUnique({
        where:{
            userId: userId
        }
    })
    const addressToSave ={
        userId: userId,
        address: address.address,
        address2: address.address2,
        countryId: address.country,
        firstName: address.firstName,
        lastName: address.lastName,
        phone: address.phone,
        postalCode: address.postalCode,
        city: address.city
    }
    if(!storedAddress){
        const newAddress = await prisma.userAddress.create({
            data:addressToSave
        })
        return newAddress;
    }
    const updatedAddress = await prisma.userAddress.update({
        where:{
            userId: userId
        },
        data: addressToSave
        })
        return updatedAddress;

} catch (error) {
    console.log(error)
    throw new Error("No se pudo grabar la direccion");
}
}