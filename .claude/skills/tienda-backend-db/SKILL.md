---
name: tienda-backend-db
description: Usar al tocar Prisma, migraciones, server actions o stock por talla en la tienda deportiva (Next.js 16 + Prisma 7 + PostgreSQL).
---

# Backend y base de datos de la tienda deportiva

Stack: Next.js 16 (App Router) con server actions, Prisma 7 con `@prisma/adapter-pg`, PostgreSQL en Docker, NextAuth v5, Zod 4.

## Dónde vive cada cosa

- `prisma/schema.prisma`: modelos. El cliente se genera en `src/generated` (no editar a mano; importar de `@/src/generated/client` y enums de `@/src/generated/enums`).
- `src/lib/prisma.ts`: instancia única de Prisma (singleton global). Importar siempre `import prisma from "@/src/lib/prisma"`, nunca crear otro `PrismaClient`.
- `src/actions/<dominio>/<accion>.ts`: una server action por archivo, con `"use server"` arriba, en kebab-case (`get-stock-by-slug.ts`). Exportarla también en `src/actions/index.ts`.
- `src/app/api/`: solo para rutas HTTP que de verdad lo necesiten (auth, stock). Lo demás va como server action.
- `src/interfaces/`: tipos compartidos con el front (`Product`, `CartProduct`, `Address`).

## Flujo para cambiar el modelo

1. Levantar la base: `docker compose up -d db` (variables en `.env`, plantilla en `.env.template`).
2. Editar `prisma/schema.prisma`.
3. `npx prisma migrate dev --name <nombre_en_snake_case>` (crea la migración y regenera el cliente).
4. Si cambia la forma de los datos de prueba, actualizar `src/seed/` y `prisma/seed.ts`, luego `npm run seed`.
5. Actualizar `src/interfaces/` y todas las actions que lean o escriban esos campos.
6. Nunca borrar ni editar migraciones ya aplicadas; crear una nueva.

## Variantes y stock por talla (migración pendiente)

Hoy `Product` tiene un solo `inStock` y `sizes Size[]` con tallas de ropa (XS…XXXL). El objetivo es:

```prisma
model ProductVariant {
  id        String  @id @default(uuid())
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  productId String
  size      String  // "38", "42", "S", "M", "L", "Única"
  stock     Int     @default(0)
  sku       String? @unique
  OrderItem OrderItem[]
  @@unique([productId, size])
}
```

- Patines usan tallas numéricas (35–45), protecciones S/M/L, patinetas y repuestos suelen ser talla única. Antes de crear productos, decidir si `size` es `String` o se amplía el enum `Size`; no meter tallas de calzado en el enum de ropa sin acordarlo.
- Migrar en pasos: (1) crear `ProductVariant` y poblarla desde `sizes` + `inStock`, (2) cambiar `OrderItem` para apuntar a `variantId`, (3) adaptar carrito, `placeOrder`, `get-stock-by-slug`, admin de productos, (4) solo al final quitar `inStock` y `sizes`.
- El carrito (`CartProduct`) debe identificar la línea por `variantId` (o `id` + `size`).

## Reglas de órdenes y stock

- Descontar stock SIEMPRE dentro de `prisma.$transaction(async (tx) => { ... })`, usando `tx`, nunca `prisma`, dentro del callback.
- Preferir un descuento condicional para evitar stock negativo sin carreras:
  ```ts
  const res = await tx.productVariant.updateMany({
    where: { id: variantId, stock: { gte: quantity } },
    data: { stock: { decrement: quantity } },
  });
  if (res.count === 0) throw new Error(`Sin inventario suficiente para ${slug} talla ${size}`);
  ```
- Los precios de la orden se calculan en el servidor desde la base, nunca desde lo que manda el cliente. Buscar el precio con `products.find(p => p.id === item.productId)` (ojo: no comparar un campo consigo mismo).
- Precios en COP: guardar enteros (sin decimales) y formatear con `src/app/utils/currencyFormat.ts`. Confirmar con el usuario la tasa de impuesto antes de cambiarla (IVA en Colombia normalmente es 19%).
- `revalidatePath` fuera del callback de la transacción o después de que termine.

## Server actions: plantilla

```ts
"use server";
import { z } from "zod";
import prisma from "@/src/lib/prisma";
import { auth } from "@/src/auth.config";

const schema = z.object({ /* ... */ });

export const miAccion = async (input: unknown) => {
  const session = await auth();
  if (session?.user.role !== "admin") {
    return { ok: false, message: "Debe estar autenticado como administrador" };
  }
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Datos inválidos" };
  try {
    // ...
    return { ok: true, data };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "No se pudo completar la operación" };
  }
};
```

- Responder siempre `{ ok, message?, ... }` con mensajes en español.
- Validar entrada con Zod; tipar parámetros (nada de `any` ni parámetros sin tipo).
- Autorizar por rol con `session.user.role` ("admin" | "user"); para recursos de un usuario, comparar `session.user.id` con el dueño (`order.userId`).
- Seleccionar solo los campos necesarios con `select` y usar `take`/`skip` para paginar.
- No subir `.env` ni secretos (Cloudinary, PayPal, `AUTH_SECRET`).
