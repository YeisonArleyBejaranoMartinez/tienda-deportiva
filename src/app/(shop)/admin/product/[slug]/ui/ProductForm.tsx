"use client";

import { Product, TypeGender } from "@/src/interfaces";
import { useForm, SubmitHandler } from "react-hook-form";
import { ProductImage  as ProductImageType} from "@/src/interfaces/product.interface";
import clsx from "clsx";
import { createUpdateProduct } from "@/src/actions/products/create-update-product";
import { useRouter } from "next/navigation";
import { ProductImage } from "@/src/components";
import { deleteProductImage } from "@/src/actions/products/delete-product-image";

interface Props {
  product: Partial<Product> & {ProductImage?: ProductImageType[]};
  categories: {
    id: string;
    name: string;
  }[];
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
type FormInputs = {
  title: string;
  slug: string;
  description: string;
  price: number;
  inStock: number;
  sizes: string[];
  tags: string;
  gender: TypeGender;
  categoryId: string;
  //TODO: images
  images: FileList;
}

export const ProductForm = ({ product, categories }: Props) => {
  const router = useRouter();
   const {
     handleSubmit,
     register,
     formState: { isValid },
     getValues,
     setValue,
     watch
   } = useForm<FormInputs>({
     defaultValues: {
       ...product,
       tags: product.tags?.join(",") ?? "",
       sizes: product.sizes ?? [],
       images: undefined
     },
   });
   watch("sizes")
  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    console.log(data);
    const formData  = new FormData();
    const {images, ...productTosave}= data;
    if(product.id){
      formData.append("id", product.id?? "");
    }
    formData.append("title", productTosave.title);
    formData.append("slug", productTosave.slug);
    formData.append("description", productTosave.description);
    formData.append("price", productTosave.price.toString());
    formData.append("inStock", productTosave.inStock.toString());
    formData.append("sizes", productTosave.sizes.join(","));
    formData.append("tags", productTosave.tags);
    formData.append("categoryId", productTosave.categoryId);
    formData.append("gender", productTosave.gender);
    console.log("Imagenes en el lado del cliente", images);
    if(images){
      for(let i = 0; i< images.length; i++){
        formData.append("images", images[i]);

      }
    }
    const {ok, product:updatedProduct} = await  createUpdateProduct(formData);
    if(!ok){
       alert("Producto no se pudo actualizar");
    }
    router.replace(`/admin/product/${updatedProduct?.slug}`);
  };
  const onSizeChanded= (size: string  )=>{
    const sizes =  new Set( getValues("sizes"));
    sizes.has(size)? sizes.delete(size): sizes.add(size);
    setValue("sizes", Array.from(sizes))


  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3"
    >
      {/* Textos */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Título</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register("title", { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Slug</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register("slug", { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Descripción</span>
          <textarea
            rows={5}
            className="p-2 border rounded-md bg-gray-200"
            {...register("description", { required: true })}
          ></textarea>
        </div>

        <div className="flex flex-col mb-2">
          <span>Price</span>
          <input
            type="number"
            className="p-2 border rounded-md bg-gray-200"
            {...register("price", { required: true, min: 0 })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Tags</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register("tags", { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Gender</span>
          <select
            className="p-2 border rounded-md bg-gray-200"
            {...register("gender", { required: true })}
          >
            <option value="">[Seleccione]</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kid">Kid</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        <div className="flex flex-col mb-2">
          <span>Categoria</span>
          <select
            className="p-2 border rounded-md bg-gray-200"
            {...register("categoryId", { required: true })}
          >
            <option value="">[Seleccione]</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selector de tallas y fotos */}
      <div className="w-full">
        {/* As checkboxes */}
        <div className="flex flex-col">
          <span>Tallas</span>
          <div className="flex flex-wrap">
            {sizes.map((size) => (
              // bg-blue-500 text-white <--- si está seleccionado
              <button
                type="button"
                onClick={() => onSizeChanded(size)}
                key={size}
                className={clsx(
                  "p-2 border rounded-md mr-2 mb-2 transition-all w-20  text-center",
                  {
                    "bg-blue-500 text-white": getValues("sizes").includes(size),
                  },
                )}
              >
                <span>{size}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col mb-2">
            <span>Fotos</span>
            <input
              type="file"
              {...register("images")}
              multiple
              className="p-2 border rounded-md bg-gray-200"
              accept="image/png, image/jpeg image/avif"
            />
          </div>
          <div className="grid  grid-cols-1 sm:grid-cols-3  gap-3">
            {product.ProductImage?.map((image) => (
              <div key={image.id} className="w-full h-48 relative">

                <ProductImage
                  src={image.url}
                  alt={product.title? product.title : ""}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  onClick={() => deleteProductImage(image.id, image.url)}
                  type="button"
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-md"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
        <button className="btn-primary w-full">Guardar</button>
      </div>
      <div className="flex flex-col mb-2">
        <span>Inventario</span>
        <input
          type="number"
          className="p-2 border rounded-md bg-gray-200"
          {...register("inStock", { required: true, min: 0 })}
        />
      </div>
    </form>
  );
};