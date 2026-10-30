import { getCategories, getProductBySlug } from '@/src/actions'
import { Title } from '@/src/components'
import { redirect } from 'next/navigation'
import { ProductForm } from './ui/ProductForm'
interface Props{
    params: Promise<{
        slug: string
    }>
}

export default async function productPage ({ params }: Props) {
    const { slug } = await params
    const [product, categories]= await Promise.all([
        getProductBySlug(slug),
        getCategories()
    ])

    // TODO: new
    if(!product && slug !== "new"){
        redirect("/admin/products")
    }
    const title = slug === "new" ? "Nuevo producto" : `Editar Producto: ${product?.title}`
  return (
    <>
      <Title title={title}/>
      <ProductForm product={product ?? {}} categories={categories}  />
    </>
  );
}
