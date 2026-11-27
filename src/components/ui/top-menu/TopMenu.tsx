"use client";
import Link from "next/link";
import {
  IoCartOutline,
  IoSearchOutline,
  IoPersonOutline,
  IoMenuOutline,
} from "react-icons/io5";
import { useUIStore } from "@/src/store";
import { useCartStore } from "../../../store/cart/cart-store";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Patines", href: "/category/patines" },
  { label: "Patinetas", href: "/category/patinetas" },
  { label: "Protecciones", href: "/category/protecciones" },
  { label: "Repuestos", href: "/category/repuestos" },
  { label: "Accesorios", href: "/category/accesorios" },
];

export const TopMenu = () => {
  const openMenu = useUIStore((state) => state.openSideMenu);
  const getTotalItems = useCartStore((state) => state.getTotalItems());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const cartCount = mounted ? getTotalItems : 0;

  return (
    <header className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div
            className="w-10 h-10 rounded-full bg-[#C45C1A] flex items-center justify-center select-none"
            aria-hidden="true"
          >
            <span className="text-white font-black text-sm leading-none tracking-tight">
              TD
            </span>
          </div>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="text-white font-black text-lg tracking-widest uppercase">
              Tienda
            </span>
            <span className="text-white/70 font-light text-[10px] tracking-[0.3em] uppercase">
              Deportiva
            </span>
          </div>
        </Link>

        {/* Nav central — solo escritorio */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Categorías">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Iconos derecha */}
        <div className="flex items-center gap-1 shrink-0">
          <Link
            href="/search"
            aria-label="Buscar productos"
            className="p-2 hover:bg-white/10 rounded transition-colors"
          >
            <IoSearchOutline className="w-6 h-6" />
          </Link>

          <Link
            href={cartCount > 0 ? "/cart" : "/empty"}
            aria-label={`Carrito${cartCount > 0 ? `, ${cartCount} artículos` : ""}`}
            className="p-2 hover:bg-white/10 rounded transition-colors relative"
          >
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] bg-[#C45C1A] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-bounce">
                {cartCount}
              </span>
            )}
            <IoCartOutline className="w-6 h-6" />
          </Link>

          {/* Botón de menú lateral (usuario + navegación móvil) */}
          <button
            onClick={openMenu}
            aria-label="Abrir menú"
            className="p-2 hover:bg-white/10 rounded transition-colors md:hidden"
          >
            <IoMenuOutline className="w-6 h-6" />
          </button>

          {/* Icono de usuario solo en escritorio */}
          <button
            onClick={openMenu}
            aria-label="Cuenta de usuario"
            className="p-2 hover:bg-white/10 rounded transition-colors hidden md:flex items-center gap-2"
          >
            <IoPersonOutline className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};
