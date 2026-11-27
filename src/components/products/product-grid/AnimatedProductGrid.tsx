import { Product } from "@/src/interfaces";
import { ProductGridItem } from "./ProductGridItem";
import { GsapStaggerGrid } from "@/src/components/motion/GsapStaggerGrid";

interface Props {
  products: Product[];
}

export const AnimatedProductGrid = ({ products }: Props) => {
  return (
    <GsapStaggerGrid className="grid grid-cols-2 sm:grid-cols-3 gap-10 mb-10">
      {products.map((product) => (
        <ProductGridItem key={product.slug} product={product} />
      ))}
    </GsapStaggerGrid>
  );
};
