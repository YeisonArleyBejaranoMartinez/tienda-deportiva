"use server";
import prisma from "@/src/lib/prisma";

export const setTransactionId = async(orderId: string, transactionId: string)=>{
    try{
        const order = await prisma.order.update({
            where: { id: orderId},
            data:{
                transactionId: transactionId,
            }
        })
        if(!order){
            return{
                ok: false,
                message:`No se encontró la orden con el id ${orderId}`,
            }

        }
        return {
            ok: true,
            order:order,
        }
    }
    catch(error){
        console.log(error);
        return {
        ok: false,
        message: "No se pudo crear el usuario",
    }
    }
}