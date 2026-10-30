import { PrismaClient, Prisma } from "../src/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { initialData } from "../src/seed/seed";
import { countries } from '../src/seed/seed-countries';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const CategoryData: Prisma.CategoryCreateInput[] = [
  "shirts",
  "pants",
  "hoodies",
  "hats",
].map((name) => ({
  name,
}));

export async function main() {
  // Eliminar en orden correcto (respetando FKs)
  await prisma.orderAddress.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();

  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.country.deleteMany();


  // Insertar categorías
  for (const u of CategoryData) {
    await prisma.category.upsert({
      where: { name: u.name },
      create: u,
      update: {}, // no actualiza nada si ya existe
    });
  }
  /*buscamos la categoría que quiero usar*/
  const categories = await prisma.category.findMany();

  for (const product of initialData.products) {
    // product.type es el texto que debe coincidir con category.name
    const category = categories.find((c) => c.name === product.type);

    if (!category) {
      console.log(
        `No se encontró categoría para type="${product.type}", se omite el producto "${product.title}"`,
      );
      continue;
    }
    // 4. Crear el producto mapeando solo los campos que existen en tu tabla
    const dbProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      create: {
        title: product.title,
        description: product.description,
        inStock: product.inStock, // ojo con el nombre exacto del campo en tu modelo
        price: product.price,
        sizes: product.sizes,
        slug: product.slug,
        tags: product.tags,
        gender: product.gender,
        categoryId: category.id, // relación por FK
      },
      update: {
        // aunque no quieras cambiar nada, Prisma exige un objeto aquí
        // puedes repetir algún campo con el mismo valor
        title: product.title,
      },
    });
    //images
    // borrar imágenes anteriores si quieres “resetear”
    await prisma.productImage.deleteMany({
      where: { productId: dbProduct.id },
    });

    // insertar imágenes nuevas
    await prisma.productImage.createMany({
      data: product.images.map((url) => ({
        url,
        productId: dbProduct.id,
      })),
    });
  }

  // console.log("products:", initialData.products);
  // console.log("Productos creados");
  // Insertar usuarios
  await prisma.user.deleteMany();
  for (const users of initialData.users) {
    await prisma.user.upsert({
      where: { email: users.email },
      create: {
        name: users.name,
        email: users.email,
        password: users.password,
        role: users.role,
      },
      update: {
        name: users.name,
        role: users.role,
      },
    });
  }
  // console.log("Usuarios creados");

  //insertar countries
  for (const country of countries) {
    await prisma.country.upsert({
      where: { id: country.id },
      create: {
        id: country.id,
        name: country.name,
      },
      update: {
        name: country.name,
      },
    });
  }
  console.log("Paises creados");
}


main();
