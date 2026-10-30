"use client";
import Link from "next/link";
import { useCartStore } from "@/src/store";
import { useEffect, useState } from "react";
import { currencyFormat } from "@/src/app/utils";
export const OrderSumary = () => {
    const [mounted, setMounted] = useState(false);
    const numerosDeProductos = useCartStore((state) => state.getSumaryInformation().itemsInCart);
    const suptotalProducts = useCartStore((state) => state.getSumaryInformation().subTotal);
    const tax = useCartStore((state) => state.getSumaryInformation().tax);
    const total = useCartStore((state) => state.getSumaryInformation().total);
    useEffect(() => {
     const timer = setTimeout(() => {
       setMounted(true);
     }, 0);

     return () => clearTimeout(timer);
   }, []);
    if (!mounted) return <p>Cargando.....</p>;
  return (
    <div className=" bg-white rounded-xl shadow-xl p-7 h-fit">
      <h2 className="text-2xl mb-2">Resumen de orden</h2>
      <div className="grid grid-cols-2">
        <span>No. de Productos</span>
        <span className="text-right">
          {currencyFormat(numerosDeProductos)} articulos
        </span>

        <span>Subtotal</span>
        <span className="text-right"> {currencyFormat(suptotalProducts)}</span>

        <span>Impuestos 15%</span>
        <span className="text-right"> {currencyFormat(tax)}</span>

        <span className="text-2xl mt-5">Total</span>
        <span className="text-right text-2xl mt-5">
          {currencyFormat(total)}
        </span>
      </div>
      <div className="mt-5  mb-1 w-full">
        <Link
          className=" btn-primary flex justify-center py-3 px-5 text-white w-full text-center mt-5"
          href="./checkout/adress"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
};
