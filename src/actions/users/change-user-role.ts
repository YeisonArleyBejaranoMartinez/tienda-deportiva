"use server"

import { auth } from "@/src/auth.config";
import prisma from "@/src/lib/prisma"
import { revalidatePath } from "next/cache";

  export const changeUserRole = async (userId: string, role: string) => {
    const  session = await auth();
    if(session?.user.role !== "admin"){
        return {
            ok: false,
            message: "No autorizado para acceder a esta información",
        }
    }
   try {
    const newRole = role === "admin" ? "admin" : "user";
    if(!userId){
        return{
            ok: false,
            message: "ID del usuario es requerido",
        }
    }
    const user = prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            role: newRole
        }
    })
    revalidatePath("/admin/users");
    return {
      ok: true,
      message: "Rol del usuario actualizado correctamente",
      user,
    };
   }
    catch (error) {
        console.error("Error updating user role:", error);
        return {
            ok: false,
            message: "Error al actualizar el rol del usuario",
        }
    }
  }