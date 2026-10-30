"use client";
import { titleFont } from "@/src/confic/fonts";
import Link from "next/link";
import { IoCartOutline, IoSearchOutline } from "react-icons/io5";
import { useUIStore } from "@/src/store";
import { useCartStore } from '../../../store/cart/cart-store';
import { useEffect, useState} from "react";


export const TopMenu = () => {
  const openMenu = useUIStore((state) => state.openSideMenu);
  const getTotalItems = useCartStore(state => state.getTotalItems());
   const [mounted, setMounted] = useState(false);
    useEffect(() => {
     const timer = setTimeout(() => {
       setMounted(true);
     }, 0);

     return () => clearTimeout(timer);
   }, []);

    // Call the handleLoad function after some asynchronous operation is complete
    // For example, if you're fetching data from an API, you can call handleLoad inside the callback of the fetch request
  if (!mounted) return <p>Cargando.....</p>;
  return (
    <div className="flex px-5 justify-between items-center w-full">
      {/* logo */}
      <div className="">
        <Link href="/">
          <span className={`${titleFont.className} antialiased font-bold `}>
            Teslo
          </span>
        </Link>
        <span>Shop</span>
      </div>
      {/* center menu */}
      <div className="hidden sm:flex">
        <Link
          className="m-2 p-2 rounded-md trancition-all hover:bg-gray-100"
          href="/gender/men"
        >
          Hombres
        </Link>
        <Link
          className="m-2 p-2 rounded-md trancition-all hover:bg-gray-100"
          href="/gender/women"
        >
          Mujeres
        </Link>
        <Link
          className="m-2 p-2 rounded-md trancition-all hover:bg-gray-100"
          href="/gender/kid"
        >
          Kid
        </Link>
        <Link
          className="m-2 p-2 rounded-md trancition-all hover:bg-gray-100"
          href="/gender/unisex"
        >
          unisex
        </Link>
      </div>
      {/* search, cart, menu */}
      <div className="flex items-center">
        <Link href="/search">
          <IoSearchOutline className="w-8 h-8" />
        </Link>
        <Link href={getTotalItems > 0 && mounted ? "/cart" : "/empty"}>
          <div className="relative">
            {mounted && getTotalItems > 0 && (
              <span className="animate-bounce absolute text-xs  rounded-full px-1 font-bold -top-2 right-2 bg-blue-700 text-white">
                {getTotalItems}
              </span>
            )}
            <IoCartOutline className="w-8 h-8" />
          </div>
        </Link>
        <button
          onClick={() => openMenu()}
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
        >
          menu
        </button>
      </div>
    </div>
  );
};
