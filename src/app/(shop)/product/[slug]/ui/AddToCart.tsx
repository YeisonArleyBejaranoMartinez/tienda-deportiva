"use client";
import { QuantitySelector, SizeSelector } from "@/src/components";
import { Product } from "@/src/interfaces";
import { useState } from "react";
import type { CartProduct, Size } from "@/src/interfaces";
import { useCartStore } from "@/src/store";
interface Props{
    product:Product
}
export const AddToCart = ({product}:Props) => {
  const  addProductToCart = useCartStore(state=> state.addProdctTocart);

    const [size, setSize] = useState<Size |undefined> ();
    const [quantity, setQuantity] = useState(1);
    const [posted, setPosted]= useState(false);


    const addToCart =()=>{
      setPosted(true);
      //TODO: agregar al carrito
      const cartProduct:CartProduct = {
        id: product.id,
        slug: product.slug,
        title: product.title,
        price: product.price,
        quantity: quantity,
        size: size!,
        image: product.images[0],
      };
      addProductToCart(cartProduct);
      setPosted(false);
      setQuantity(1);
      setSize(undefined);
    }
  return (
    <>
      {!size && posted && <span className="mt-2 text-red-500">Debe de seleccionar una talla.</span>}

      {/*selector de tallas */}
      <SizeSelector
        Selectedsizes={size}
        availableSizes={product.sizes}
        onSizeChanged={setSize}
      />
      {/*selector de cantidad */}
      <QuantitySelector quantity={quantity} onQuantityChanged={setQuantity} />
      {/*Boton */}
      <button onClick={addToCart} className="btn-primary my-5">
        Agregar al carrito
      </button>
    </>
  );
}
