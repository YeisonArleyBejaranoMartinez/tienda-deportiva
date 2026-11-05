# Tienda deportiva (base: Teslo Shop)

- Stack: Next.js 16 (App Router), React 19, Prisma 7, PostgreSQL en Docker, NextAuth v5, Zustand, Tailwind 4
- Tienda de patines, patinetas, protecciones y repuestos
- Los productos tienen variantes (tallas) con stock propio
- Inventario de un aliado con tienda física en Bogotá
- Textos de la tienda en español (precios en COP)

## Comandos

- `docker compose up -d db` — levanta solo PostgreSQL (para `npm run dev`); variables en `.env` (ver `.env.template`)
- `docker compose --profile app up -d --build` — levanta todo: `db` + `migrate` (aplica migraciones) + `app` (Next.js en el puerto 3000)
- `npx prisma migrate dev --name <nombre>` — crea y aplica una migración tras cambiar `prisma/schema.prisma`
- `npm run seed` — carga datos de prueba (`prisma/seed.ts`)
- `npm run dev` — servidor de desarrollo
- `npm run lint` — revisar antes de terminar cualquier cambio

## Estructura

- `prisma/schema.prisma` — modelos; el cliente se genera en `src/generated` (no editar a mano)
- `src/actions/` — server actions por dominio (`products`, `order`, `payments`, ...)
- `src/app/(shop)/` — páginas de la tienda y del admin (`admin/`)
- `src/components/`, `src/store/` (Zustand: carrito, dirección, UI), `src/interfaces/`

## Modelo de productos y stock

- Cada `Product` tiene `variants: ProductVariant[]` con `size` (texto libre: "38", "M", "Única", "80mm") y `stock` propio.
- El stock total de un producto es la suma de sus variantes; ya no existe `Product.inStock` ni el enum `Size`.
- `OrderItem.size` guarda la talla comprada como texto.
- Las tallas se ordenan con `sortVariants` (`src/app/utils/sortVariants.ts`).
- La página de producto se cachea; el stock en vivo sale de `/api/stock/[slug]`.
- Categorías: patines, patinetas, protecciones, repuestos. El seed (`src/seed/seed.ts`) tiene datos de prueba sin imágenes.

## Convenciones

- Toda la UI y mensajes al usuario en español.
- No subir `.env` ni secretos.
- Al descontar stock en una orden, hacerlo dentro de una transacción de Prisma y solo si `stock >= cantidad` (ver `placeOrder.ts`).
- Precios en COP: mostrarlos con `currencyFormat`.
