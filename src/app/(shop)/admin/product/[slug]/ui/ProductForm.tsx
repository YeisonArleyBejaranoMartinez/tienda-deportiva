"use client";

import { Product, TypeGender } from "@/src/interfaces";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { ProductImage  as ProductImageType} from "@/src/interfaces/product.interface";
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

// Tallas sugeridas para agregar con un clic
const suggestedSizes = ["34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "XS", "S", "M", "L", "XL", "Única"];
type FormInputs = {
  title: string;
  slug: string;
  description: string;
  price: number;
  variants: { size: string; stock: number }[];
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
     control,
     watch
   } = useForm<FormInputs>({
     defaultValues: {
       ...product,
       tags: product.tags?.join(",") ?? "",
       variants: product.variants ?? [],
       images: undefined
     },
   });
   const { fields, append, remove } = useFieldArray({ control, name: "variants" });
   const currentVariants = watch("variants");
  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (data.variants.length === 0) {
      alert("Agregue al menos una talla");
      return;
    }
    const formData  = new FormData();
    const {images, ...productTosave}= data;
    if(product.id){
      formData.append("id", product.id?? "");
    }
    formData.append("title", productTosave.title);
    formData.append("slug", productTosave.slug);
    formData.append("description", productTosave.description);
    formData.append("price", productTosave.price.toString());
    formData.append("variants", JSON.stringify(productTosave.variants));
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
       return;
    }
    router.replace(`/admin/product/${updatedProduct?.slug}`);
  };
  const addSize = (size: string) => {
    if (currentVariants.some((v) => v.size === size)) return;
    append({ size, stock: 0 });
  };
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
          <span>Precio (COP)</span>
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
          <span>Género</span>
          <select
            className="p-2 border rounded-md bg-gray-200"
            {...register("gender", { required: true })}
          >
            <option value="">[Seleccione]</option>
            <option value="men">Hombre</option>
            <option value="women">Mujer</option>
            <option value="kid">Niños</option>
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
        {/* Tallas con su stock */}
        <div className="flex flex-col">
          <span>Tallas e inventario</span>
          {fields.length === 0 && (
            <p className="text-sm text-red-500 mb-2">Agregue al menos una talla.</p>
          )}
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Talla"
                className="p-2 border rounded-md bg-gray-200 w-24"
                {...register(`variants.${index}.size`, { required: true })}
              />
              <input
                type="number"
                placeholder="Stock"
                className="p-2 border rounded-md bg-gray-200 w-24"
                {...register(`variants.${index}.stock`, { required: true, min: 0, valueAsNumber: true })}
              />
              <span className="text-sm">unidades</span>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-500 underline text-sm"
              >
                Quitar
              </button>
            </div>
          ))}
          <div className="flex flex-wrap mb-4">
            {suggestedSizes
              .filter((size) => !currentVariants.some((v) => v.size === size))
              .map((size) => (
                <button
                  type="button"
                  onClick={() => addSize(size)}
                  key={size}
                  className="p-1 border rounded-md mr-2 mb-2 w-14 text-center text-sm"
                >
                  + {size}
                </button>
              ))}
            <button
              type="button"
              onClick={() => append({ size: "", stock: 0 })}
              className="p-1 border rounded-md mr-2 mb-2 px-2 text-sm"
            >
              + Otra talla
            </button>
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
    </form>
  );
};