"use client";

import { signOut } from "next-auth/react";
// import { signOut } from "@/src/auth.config";
// import logout from '@/src/actions';
export const logout = async () =>{
    await signOut();
}


