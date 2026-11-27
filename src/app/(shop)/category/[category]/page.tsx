export const revalidate = 60;

import { getPaginatedProductsWithImages } from "@/src/actions";
import { Pagination, Title, GsapRevealTitle, AnimatedProductGrid } from "@/src/components";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const CATEGORY_LABELS: Record<string, string> = {
  patines: "Patines",
  patinetas: "Patinetas",
  protecciones: "Protecciones",
  repuestos: "Repuestos",
  accesorios: "Accesorios",
};

type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const label = CATEGORY_LABELS[category];
  if (!label) return {};
  return {
    title: `${label} | Tienda Deportiva`,
    description: `Encuentra los mejores ${label.toLowerCase()} para patinaje en nuestra tienda.`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const { page: pageParam } = await searchParams;

  const label = CATEGORY_LABELS[category];
  if (!label) notFound();

  const page = pageParam ? parseInt(pageParam) : 1;

  const { products, totalPages } = await getPaginatedProductsWithImages({
    page,
    categoryName: category,
  });

  return (
    <div className="px-4 sm:px-0">
      <GsapRevealTitle>
        <Title
          title={label}
          subTitle={
            products.length > 0
              ? `${products.length > 1 ? `${products.length} productos disponibles` : "1 producto disponible"}`
              : "Próximamente nuevos productos"
          }
          className="mb-0"
        />
      </GsapRevealTitle>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center text-gray-500">
          <p className="text-2xl font-semibold mb-2">Sin productos por ahora</p>
          <p className="text-sm">
            Estamos trabajando para traerte los mejores {label.toLowerCase()}.
            ¡Vuelve pronto!
          </p>
        </div>
      ) : (
        <>
          <AnimatedProductGrid products={products} />
          <Pagination totalPages={totalPages} />
        </>
      )}
    </div>
  );
}
