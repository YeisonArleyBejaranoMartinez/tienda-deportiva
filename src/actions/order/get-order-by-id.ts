"use server";
import {auth} from "@/src/auth.config";
import prisma from "@/src/lib/prisma";
export const getOrderById = async(id )=>{
    const session = await auth();
    if(!session){
        return{
            ok:false,
            message: "debe de estar autenticado"
        }
    }
    try{
        const order = await prisma.order.findFirst({
          where: { id },
          include: {
            OrderAddress: true,
            OrderItem: {
                select:{
                    price:true,
                    quantity: true,
                    size: true,
                    product:{
                        select:{
                            title: true,
                            slug: true,
                            ProductImage:{
                                select:{
                                    url: true
                                }, take: 1
                            }
                        }
                    }
                }
            },
          },
        });
        if(!order) throw `${id} no existe`;
        if(session.user.id ==="user"){
            if(session.user.id !== order.userId){
                throw `${id} no es de este usuario`;
            }

        }
        // console.log(order);
        return{
            ok: true,
            order
        }

    }catch(error){
        console.log(error);
        return{
            ok: false,
            message: "Orden no existe"
        }
    }
}