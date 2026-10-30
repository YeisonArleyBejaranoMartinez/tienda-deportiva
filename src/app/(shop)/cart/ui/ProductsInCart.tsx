"use client"
import { ProductImage, QuantitySelector } from '@/src/components'
import { useCartStore } from '@/src/store'
import Image from 'next/image'
import Link from 'next/link'
const ProductsInCart = () => {
  const updateProducrtQuantity = useCartStore(state => state.updateProductQuantity)
  const productsInCart= useCartStore(state => state.cart)
  const removeProductCart = useCartStore(state => state.removeProduct)


  return (
    <>
      {productsInCart.map((product) => (
        <div key={`${product.slug}-${product.size}`} className="flex mb-5">
          <ProductImage
            src={product.image}
            width={100}
            height={50}
            alt={product.title}
          />
          <div className="">
            <Link href={`/product/${product.slug}`}>
              {product.size}-{product.title}
            </Link>
            <p className="text-xl">${product.price}</p>
            <QuantitySelector
              quantity={product.quantity}
              onQuantityChanged={(quantity) =>
                updateProducrtQuantity(product, quantity)
              }
            />
            <button className="underline mt-3" onClick={()=>removeProductCart(product)}>
              Remover
            </button>
          </div>
        </div>
      ))}
    </>
  );
}

export default ProductsInCart