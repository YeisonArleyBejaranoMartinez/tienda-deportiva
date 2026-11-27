import { getFeaturedProducts } from "@/src/actions";
import { currencyFormat } from "@/src/app/utils";
import { ProductImage } from "@/src/components/product/product-image/product-image";
import { GsapRevealTitle } from "@/src/components/motion/GsapRevealTitle";
import { GsapStaggerGrid } from "@/src/components/motion/GsapStaggerGrid";
import { titleFont } from "@/src/confic/fonts";
import Link from "next/link";

const CATEGORY_LABELS: Record<string, string> = {
  patines: "Patines",
  patinetas: "Patinetas",
  protecciones: "Protecciones",
  repuestos: "Repuestos",
  accesorios: "Accesorios",
};

export const FeaturedProducts = async () => {
  const products = await getFeaturedProducts();
  if (products.length === 0) return null;

  return (
    <section className="mb-12">
      <GsapRevealTitle>
        <h2
          className={`${titleFont.className} text-3xl font-bold text-center tracking-wide uppercase`}
        >
          Productos Destacados
        </h2>
      </GsapRevealTitle>

      <GsapStaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const hasDiscount =
            product.originalPrice != null && product.originalPrice > product.price;
          const discountPct = hasDiscount
            ? Math.round((1 - product.price / product.originalPrice!) * 100)
            : 0;

          return (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              {/* Imagen */}
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                <ProductImage
                  src={product.images[0]}
                  alt={product.title}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Badge destacado */}
                <span className="absolute top-3 left-3 bg-[#274494] text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                  Destacado
                </span>

                {/* Badge descuento */}
                {hasDiscount && (
                  <span className="absolute top-3 right-3 bg-[#C45C1A] text-white text-xs font-bold px-2 py-1 rounded-full">
                    -{discountPct}%
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                {product.category && (
                  <span className="text-xs text-gray-400 uppercase tracking-wider">
                    {CATEGORY_LABELS[product.category] ?? product.category}
                  </span>
                )}

                <p className="mt-1 text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-[#274494] transition-colors">
                  {product.title}
                </p>

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-base font-bold text-gray-900">
                    {currencyFormat(product.price)}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-gray-400 line-through">
                      {currencyFormat(product.originalPrice!)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </GsapStaggerGrid>
    </section>
  );
};
