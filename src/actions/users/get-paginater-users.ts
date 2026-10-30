"use server";
import { auth } from "@/src/auth.config";
import prisma from "@/src/lib/prisma";

export const getPaginatedUsers = async () => {
    const session = await auth();
  try {
    if(session?.user.role !== "admin"){
        return {
            ok: false,
            message: "No autorizado para acceder a esta información",
        }
    }

    const users = await prisma.user.findMany({
        orderBy: {
            name: "desc",
        },
    });
    return {
        ok: true,
        users: users,
    };

  } catch (error) {
    console.error("Error fetching paginated users:", error);
    return { ok: false, users: [], totalPages: 0 };
  }
};