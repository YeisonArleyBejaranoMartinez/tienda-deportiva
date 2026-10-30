"use client"
import { currencyFormat } from '@/src/app/utils'
import { useCartStore } from '@/src/store'
import Image from 'next/image'
const ProductsInCart = () => {
  const productsInCart= useCartStore(state => state.cart)
  return (
    <>
      {productsInCart.map((product) => (
        <div key={`${product.slug}-${product.size}`} className="flex mb-5">
          <Image
            src={`/products/${product.image}`}
            width={100}
            height={50}
            alt={product.title}
          />
          <div className="">
            <span>
              {product.size}-{product.title}({product.quantity})
            </span>
            <p className="font-bold">{currencyFormat(product.price * product.quantity)}</p>
          </div>
        </div>
      ))}
    </>
  );
}

export default ProductsInCart