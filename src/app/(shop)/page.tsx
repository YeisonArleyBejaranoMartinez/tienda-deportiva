export const revalidate = 60;
import { FeaturedProducts } from "@/src/components";

export default async function Home() {
  return (
    <>
      <FeaturedProducts />
    </>
  );
}
