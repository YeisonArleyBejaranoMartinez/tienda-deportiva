import { Title } from "@/src/components";
import Link from "next/link";
import ProductsInCart from "./ui/ProductsInCart";
import { OrderSumary } from "./ui/OrderSumary";

export default function CartPage() {
  {
    /* TODO: falta hacer la validacion  if(productsInCart.length === 0){ */
    /*redirect("/empty");*/
  }
  return (
    <div className="flex justify-center items-center mb-72 pz-10 sm:px-0">
      <div className="flex flex-col w-250">
        <Title title="Carrito" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/*carrito */}
          <div className="flex flex-col mt-5">
            <span className="text-xl">Agregar mas items </span>
            <Link className=" mb-5 underline" href="./">
              Continua comprando
            </Link>

            {/*Itemss*/}
            <ProductsInCart />

          </div>
          {/*checkout  resumen de la compra*/}
          <OrderSumary />

        </div>
      </div>
    </div>
  );
}
