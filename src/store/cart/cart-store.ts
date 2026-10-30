import type { CartProduct } from "@/src/interfaces"
import { create } from "zustand"
import { persist } from "zustand/middleware"
interface State {
  cart: CartProduct[]
  //agregar producto al carrito.
  addProdctTocart: (product: CartProduct) => void
  //actualizar la cantidad.
  updateProductQuantity:(product:CartProduct, quantity:number)=>void
  // setTotalItems: (totalItems: number) => void
  getTotalItems:() => number
  //remover el producto.
  removeProduct:(product:CartProduct, )=>void
  //obtener la informacion del carrito
  // getSumaryInformation:()=>void
   getSumaryInformation: () => {
    subTotal: number;
    tax: number;
    total: number;
    itemsInCart: number;
  }
  clearCart: ()=>void;
}
export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],
      getTotalItems: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.quantity, 0);
      },
      addProdctTocart: (product: CartProduct) => {
        const { cart } = get();

        //1. revisar si el producto ya existe en el carrito con la talla seleccionada.
        const productInCart = cart.some(
          (item) => item.id == product.id && item.size == product.size,
        );
        if (!productInCart) {
          set({
            cart: [...cart, product],
          });
          return;
        }
        //2. si el producto existe por talla. tengo que incrementar
        const updatedCartProducts = cart.map((item) => {
          if (item.id == product.id && item.size == product.size) {
            return {
              ...item,
              quantity: item.quantity + product.quantity,
            };
          }
          return item;
        });

        set({
          cart: updatedCartProducts,
        });
      },
      updateProductQuantity: (product: CartProduct, quantity: number) => {
        const { cart } = get();
        const updatedCartProducts = cart.map((items) => {
          if (items.id == product.id && items.size == product.size) {
            return {
              ...items,
              quantity: quantity,
            };
          }
          return items;
        });
        set({
          cart: updatedCartProducts,
        });
      },
      // setTotalItems: (totalItems: number) => {
      //   // set({ totalItems })
      // },
      removeProduct: (product: CartProduct) => {
        const { cart } = get();
        const updatedCartProducts = cart.filter(
          (items) => items.id !== product.id || items.size !== product.size,
        );
        set({
          cart: updatedCartProducts,
        });
      },
      clearCart: () => {
        set({
          cart: [],
        });
      },
      getSumaryInformation: () => {
        const { cart } = get();
        const subTotal = cart.reduce(
          (subTotal, product) => product.price * product.quantity + subTotal,
          0,
        );
        const tax = subTotal * 0.15;
        const total = subTotal + tax;
        const itemsInCart = cart.reduce(
          (total, item) => total + item.quantity,
          0,
        );

        return { subTotal, tax, total, itemsInCart };
      },
    }),
    {
      name: "shopping-cart",
      // skipHydration: true,
    },
  ),
);