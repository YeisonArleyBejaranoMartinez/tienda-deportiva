"use client";
import { QuantitySelector, SizeSelector } from "@/src/components";
import { useEffect, useState } from "react";
import type { CartProduct, Product, ProductVariant, Size } from "@/src/interfaces";
import { useCartStore } from "@/src/store";

interface Props {
  product: Product;
}
export const AddToCart = ({ product }: Props) => {
  const addProductToCart = useCartStore((state) => state.addProdctTocart);

  // La página se cachea, así que el stock por talla se consulta en vivo.
  const [variants, setVariants] = useState<ProductVariant[]>(product.variants);
  const [size, setSize] = useState<Size | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [posted, setPosted] = useState(false);

  useEffect(() => {
    fetch(`/api/stock/${product.slug}`)
      .then((res) => res.json())
      .then((data) => setVariants(data.variants))
      .catch(() => {});
  }, [product.slug]);

  const stockForSize = variants.find((v) => v.size === size)?.stock ?? 0;
  const soldOut = variants.every((v) => v.stock <= 0);

  const onSizeChanged = (newSize: Size) => {
    setSize(newSize);
    setQuantity(1);
  };

  const addToCart = () => {
    setPosted(true);
    if (!size) return;

    const cartProduct: CartProduct = {
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      quantity: quantity,
      size: size,
      image: product.images[0],
    };
    addProductToCart(cartProduct);
    setPosted(false);
    setQuantity(1);
    setSize(undefined);
  };

  if (soldOut) {
    return <p className="my-5 font-bold text-red-500">Producto agotado</p>;
  }

  return (
    <>
      {!size && posted && (
        <span className="mt-2 text-red-500">Debe seleccionar una talla.</span>
      )}

      {/*selector de tallas */}
      <SizeSelector
        selectedSize={size}
        variants={variants}
        onSizeChanged={onSizeChanged}
      />
      {size && (
        <p className="mb-2 text-sm">Talla {size}: {stockForSize} disponibles</p>
      )}
      {/*selector de cantidad */}
      <QuantitySelector
        quantity={quantity}
        onQuantityChanged={setQuantity}
        max={size ? Math.min(stockForSize, 5) : 5}
      />
      {/*Boton */}
      <button onClick={addToCart} className="btn-primary my-5">
        Agregar al carrito
      </button>
    </>
  );
};
