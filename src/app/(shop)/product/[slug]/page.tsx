export const revalidate = 604800;
import { ProductSlideShow } from "@/src/components";
import { titleFont } from "@/src/confic/fonts";
import { notFound } from "next/navigation";
import { ProductMovileSlideShow } from "../../../../components/product/slide-show/ProductMovileSlideShow";
import { getProductBySlug } from "@/src/actions";
import  {StockLabel } from "@/src/components/stock-label/StockLabel";

interface Props {
  params: {
    slug: string;
  };
}
type PropsMetadata = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
import type { Metadata, ResolvingMetadata } from "next";
import {AddToCart} from "./ui/AddToCart"



export async function generateMetadata(
  { params }: PropsMetadata,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  // fetch post information
  const post = await fetch(`https://api.vercel.app/blog/${slug}`).then((res) =>
    res.json(),
  );

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      //images : [], // https: // misitioweb.com/products/imagen_1.png
      images: [
        {
          url: post.image,
        }
      ],
    },
  };
}

export default async function Produc({ params }: Props) {
  const { slug } = await params;
  const product =  await getProductBySlug(slug);
  // console.log(product);
  if (!product) {
    notFound();
  }
  return (
    <div className="mt-5 mb-20  grid grid-cols-1 md:grid-cols-3 gap-3">
      {/*slide Show*/}
      <div className="col-span-1 md:col-span-2 ">
        {/*movil slide show  */}
        <ProductMovileSlideShow
          className="block md:hidden"
          title={product.title}
          images={product.images}
        />
        <ProductSlideShow
          className="hidden md:block"
          title={product.title}
          images={product.images}
        />
      </div>
      {/*detalles del producto */}
      <div className="col-span-1 px-5 bg-blue-200 mb-10">
        <StockLabel slug={product.slug} />
        <h1 className={`${titleFont.className} antialiased text-px font-bold`}>
          {product.title}
        </h1>
        <p className="text-log mb-5">${product.price}</p>
        <AddToCart product={product}/>
        {/*descripcion */}
        <h3 className="font-bold text-sm">Descripción</h3>
        <p className="font-light">{product.description}</p>
      </div>
    </div>
  );
}
