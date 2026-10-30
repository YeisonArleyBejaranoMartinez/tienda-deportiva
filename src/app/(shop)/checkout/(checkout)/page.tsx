import {  Title } from "@/src/components";

import ProductsInCart from "./ui/ProductsInCart";
import { PlaceOrder } from "./ui/placeOrder";
export default function CheckoutPage() {
  return (
    <div className="flex justify-center items-center mb-72 pz-10 sm:px-0">
      <div className="flex flex-col w-250">
        <Title title="verificar orden" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/*carrito */}
          <div className="flex flex-col mt-5">
            <span className="text-xl">Ajustar elementos</span>
            {/* <Link className=" mb-5 underline" href="./cart">
              editar carrito aqui
            </Link> */}

            {/*Itemss*/}
           <ProductsInCart />
          </div>
          {/*checkout  resumen de la compra*/}
          <PlaceOrder/>

        </div>
      </div>
    </div>
  );
}
