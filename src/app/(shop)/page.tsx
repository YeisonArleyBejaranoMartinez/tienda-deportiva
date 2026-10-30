export const revalidate = 60; //60 segundos
import { getPaginatedProductsWithImages } from "@/src/actions";
import { redirect } from "next/navigation";
import { ProductGrid, Title, Pagination } from "@/src/components";
interface Props {
  searchParams: {
    page?: string;
    take?: string;
  };
}
export default async function Home({ searchParams }: Props) {
  const { page, take } = await searchParams;
  const pageInt = page ? parseInt(page) : 1;
  // const take = searchParams.take ? parseInt(searchParams.take) : 12;
  const {
    products = [],
    totalPages,
    // currentPage,
  } = await getPaginatedProductsWithImages({
    page: pageInt,
    take: take ? parseInt(take) : 12,
  });
  // console.log({ totalPages, currentPage });
  if (products.length === 0) {
    redirect("./");
  }
  return (
    <>
      <Title title="Tienda" subTitle="Todos los Productos" className="mb-2 " />
      <ProductGrid products={products} />
      <Pagination totalPages={totalPages} />
    </>
  );
}
