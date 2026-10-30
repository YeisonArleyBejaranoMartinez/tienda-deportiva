"use server"
import prisma from "@/src/lib/prisma";
import {auth} from "@/src/auth.config";

export const  getOrdersByUser= async ()=>{
    const session = await auth();
    if(!session?.user){
        return{
            ok:false,
            message: "debe de estar autenticado"
        }
    }

        const orders = await prisma.order.findMany({
            where:{userId:session?.user.id},
            include:{
                OrderAddress: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }

        });
        return{
             ok:true,
             orders: orders,
             message: "ordenes obtenidas exitosamente",
            }



}