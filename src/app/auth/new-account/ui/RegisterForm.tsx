"use client";
import { registerUser } from "../../../../actions/auth/register";
import{login} from "../../../../actions/auth/login"
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
type FormInputs = {
  name: string;
  email: string;
  password: string;
};
export const RegisterForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const { register, handleSubmit, formState: {errors} } = useForm<FormInputs>();
const onsubmit: SubmitHandler<FormInputs> =async (data) => {
    const {name, email, password}=data
   const res =  await registerUser(name, email, password)
   if(!res.ok){
       setErrorMessage(res.message)
       return
   }
   await  login(email, password)
   window.location.replace("/");
}
  return (
    <form onSubmit={handleSubmit(onsubmit)} className="flex flex-col">
        {errors.name?.type === "required" && <span className="text-red-500">El nombre es requerido</span>}
        {errors.email?.type === "required" && <span className="text-red-500">El correo es requerido</span>}
        {errors.password?.type === "required" && <span className="text-red-500">La contraseña es requerida</span>}
      <label htmlFor="name">Nombre Completo</label>
      <input

        type="text"
        {...register("name", {required: true})}
        autoFocus
        className={
            clsx(
            "px-5 py-2 border bg-gray-200 rounded mb-5",
            {
            "border-red-500": errors.name
            }
            )

        }
      />
      <label htmlFor="email">Correo Electronico</label>
      <input
                className={
            clsx(
            "px-5 py-2 border bg-gray-200 rounded mb-5",
            {
            "border-red-500": errors.email
            }
            )

        }
        type="email"
        {...register("email", {required: true, pattern: /^\S+@\S+$/i})}
      />

      <label htmlFor="password">Contraseña</label>
      <input
                className={
            clsx(
            "px-5 py-2 border bg-gray-200 rounded mb-5",
            {
            "border-red-500": errors.password
            }
            )

        }
        type="password"
        {...register("password", {required: true})}
      />
    <span className="text-red-500">{errorMessage}</span>
    <button className="btn-primary">Registrar</button>

      {/* divisor l ine */}
      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500"></div>
        <div className="px-2 text-gray-800">O</div>
        <div className="flex-1 border-t border-gray-500"></div>
      </div>

      <Link href="./login" className="btn-secondary text-center">
        Ingresar
      </Link>
    </form>
  );
};
