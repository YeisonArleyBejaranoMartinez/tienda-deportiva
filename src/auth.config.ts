import type { NextAuthConfig } from 'next-auth';
import NextAuth from 'next-auth';
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import prisma from './lib/prisma';
import bcryptjs from 'bcryptjs';

interface TokenData {
  id: string;
  name: string;
  email: string;
  emailVerified: Date | null;
  role: string;
  image?: string;
}

export const authConfig: NextAuthConfig = {
  pages: {
     signIn: '/auth/login',
    newUser: '/auth/new-account',

  },
  callbacks:{
  jwt:({token, user}) =>{
    if(user){
      token.data =user;
    }
    return token;
  },
  session({session, token, user}){
    //  console.log(session, token, user);
     session.user = token.data as TokenData;
    return session;
  }
  },
  providers: [
    Credentials({
      async authorize(credentials) {
          const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(3) })
          .safeParse(credentials);
        if(!parsedCredentials.success) return null;
        const { email, password } = parsedCredentials.data;
        // buscar el correo
        // .findUnique({ where: { email: email.toLowerCase() } });
        // const user = await prisma.user.findMany;
        const user = await prisma.user.findUnique({
          where: { email: email },
        });
        console.log(JSON.stringify(user, null, 2));

        if(!user) return null;
        // comparar las contraseñas
        if( !bcryptjs.compareSync ( password, user.password as string ) ) return null;
        //regresar el usuario
        // Regresar el usuario sin el password
        const { password: _, ...rest } = user;
        return rest;
      },
    }),

  ]
}
export const {  signIn, signOut, auth, handlers } = NextAuth( authConfig );