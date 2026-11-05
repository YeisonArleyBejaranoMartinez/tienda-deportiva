"use client";
import { Product } from "@/src/interfaces";
import { ProductImage } from "../../product/product-image/product-image";
import { currencyFormat } from "@/src/app/utils";
import Link from "next/link";
import { useState } from "react";

interface Props {
  product: Product;
}
export const ProductGridItem = ({ product }: Props) => {
  const [displayImage, setdisplayImage] = useState(product.images[0]);
  return (
    <div className="rounded-md overflow-hidden fade-in">
      <Link href={`/product/${product.slug}`}>
        <ProductImage
          src={displayImage}
          alt={product.title}
          width={500}
          height={500}
          className="w-full object-cover rounded-2xl "
          onMouseEnter={() => setdisplayImage(product.images[1] ?? product.images[0])}
          onMouseLeave={() => setdisplayImage(product.images[0])}
        />
      </Link>
      <div className="p-4 flex flex-col">
        <Link className="hover:text-blue-600" href={`/product/${product.slug}`}>
          {product.title}
        </Link>
        <span className="font-bold">{currencyFormat(product.price)}</span>
      </div>
    </div>
  );
};
