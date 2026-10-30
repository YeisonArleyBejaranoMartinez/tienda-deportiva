export const revalidate = 60;
// false | 0 | number
import { getPaginatedProductsWithImages } from "@/src/actions";
import { ProductGrid, Title, Pagination } from "@/src/components";
import { Gender } from "@/src/generated/enums";
import { redirect } from "next/navigation";

type Props = {
  params: {
    gender: string;
  };
  searchParams: {
    page?: string;
  };
};
export default async function CategoryPage({ params, searchParams }: Props) {
  const { gender } = await params;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const { products, totalPages } = await getPaginatedProductsWithImages({
    page,
    gender: gender as Gender,
  });
  if (products.length === 0) {
    redirect(`/gender/${gender}`);
  }

  const labels: Record<string, string> = {
    men: "Hombres",
    women: "Mujeres",
    kid: "Niños",
    unisex: "Articulos para todos",
  };
  //  if(id === 'kid'){
  //   notFound();
  //  }
  return (
    <div>
      <Title
        title={`Productos de ${labels[gender]}`}
        subTitle={`Todos los productos `}
        className="mb-2"
      />
      <ProductGrid products={products} />
      <Pagination totalPages={totalPages} />
    </div>
  );
}
