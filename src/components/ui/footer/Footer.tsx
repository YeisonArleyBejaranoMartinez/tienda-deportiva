import { titleFont } from "@/src/confic/fonts";
import Link from "next/link";

export const Footer = () => {
  return (
    <div className="flex w-full justify-center text-xs mb-10">
      <Link href="./">
        <span className={`${titleFont.className} antialiased font-bold`}>
          Tienda Deportiva
        </span>
        <span> ©{new Date().getFullYear()}</span>
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
