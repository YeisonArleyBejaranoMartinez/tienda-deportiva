import { titleFont } from "@/src/confic/fonts";
import Link from "next/link";
import { title } from "process";

export const Footer = () => {
  return (
    <div className="flex w-full justify-center text-xs mb-10">
      <Link href="./">
        <span className={`${titleFont.className} antialiased font-bold`}>
          Teslo{" "}
        </span>
        <span>| Shop</span>
        <span>©{new Date().getFullYear()}</span>
      </Link>
      <Link href="./" className="mx-3">
        <span>Terminos y condiciones</span>
      </Link>
      <Link href="./" className="mx-3">
        <span>Ubicaciones</span>
      </Link>
    </div>
  );
};
