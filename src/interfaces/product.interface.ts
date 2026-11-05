export interface Product {
  id: string;
  description: string;
  images: string[];
  price: number;
  variants: ProductVariant[];
  slug: string;
  tags: string[];
  title: string;
  //TODO: type: Type;
  gender: TypeGender;
}
export interface  CartProduct {
  id: string;
  slug: string;
  title: string;
  price: number;
  quantity: number;
  size: Size;
  image: string;
}
export interface ProductImage{
  id: number;
  url: string;
  productId: string;
  product?: Product;
}
// Talla libre: "38", "40", "S", "M", "Única", "54mm"...
export type Size = string;
export interface ProductVariant {
  size: Size;
  stock: number;
}
export type TypeGender = "men" | "women" | "kid" | "unisex" | "other";
