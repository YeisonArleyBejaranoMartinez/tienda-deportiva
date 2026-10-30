"use client";
import { useAddressStore, useCartStore } from "@/src/store";
import { useEffect, useState } from "react";
import { currencyFormat } from "@/src/app/utils";
import {placeOrder} from "../../../../../actions/order/placeOrder";
import clsx from "clsx";
import { useRouter } from "next/navigation";


export const PlaceOrder = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState(" ");
  const address = useAddressStore((state) => state.address);
  const numerosDeProductos = useCartStore(
    (state) => state.getSumaryInformation().itemsInCart,
  );
  const suptotalProducts = useCartStore(
    (state) => state.getSumaryInformation().subTotal,
  );
  const tax = useCartStore((state) => state.getSumaryInformation().tax);
  const total = useCartStore((state) => state.getSumaryInformation().total);
  const cart = useCartStore(state=>state.cart);
  const clearCart= useCartStore(state=> state.clearCart)

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 0);
  }, []);
  const onPlaceOrder = async()=>{
    setIsPlacingOrder(true);
    const productsToOrder = cart.map(product=>({
      productId: product.id,
      slug: product.slug,
      size: product.size,
      quantity: product.quantity,
    }))
    // await sleep(2000);
    // TODO: llamado al server action
    const  resp = await placeOrder(productsToOrder, address);
   if(!resp.ok){
     setIsPlacingOrder(false);
     setErrorMessage(resp.message!);
     return
   }
   //* Todo salio bien
   clearCart();
   router.replace("/orders/"+resp.order?.id);

  }
  if (!loaded) {
    console.log("Cargando direccion...");
  }

  return (
    <div className=" bg-white rounded-xl shadow-xl p-7">
      <h2 className="text-2xl bm-2">Direccion de entrega</h2>
      <div className="mb-10">
        <p>
          <strong>Nombre:</strong> {address?.firstName} {address?.lastName}
        </p>
        <p>
          <strong>Telefono:</strong> {address?.phone}
        </p>
        <p>
          <strong>Direccion:</strong> {address?.address}
        </p>
        <p>
          <strong>Ciudad:</strong> {address?.city} {address?.country}
        </p>
        <p>
          <strong>Codigo postal:</strong> {address?.postalCode}
        </p>
      </div>
      <div className="w-full h-0.5 rpuded bg-gray-200 mb-10" />
      <div className=" bg-white rounded-xl shadow-xl p-7 h-fit">
        <h2 className="text-2xl mb-2">Resumen de orden</h2>
        <div className="grid grid-cols-2">
          <span>No. de Productos</span>
          <span className="text-right">
            {currencyFormat(numerosDeProductos)} articulos
          </span>

          <span>Subtotal</span>
          <span className="text-right">
            {" "}
            {currencyFormat(suptotalProducts)}
          </span>

          <span>Impuestos 15%</span>
          <span className="text-right"> {currencyFormat(tax)}</span>

          <span className="text-2xl mt-5">Total</span>
          <span className="text-right text-2xl mt-5">
            {currencyFormat(total)}
          </span>

         <p className="text-red-500">{errorMessage}</p>
          <button
          disabled={isPlacingOrder}
          onClick={onPlaceOrder}
          className={clsx({
            "btn-primary": !isPlacingOrder,
            "btn-disabled": isPlacingOrder,
          })}>
            Confirmar Orden
          </button>
        </div>
      </div>
    </div>
  );
};
