# Tienda deportiva (base: Teslo Shop)

- Stack: Next.js 16 (App Router), React 19, Prisma 7, PostgreSQL en Docker, NextAuth v5, Zustand, Tailwind 4
- Tienda de patines, patinetas, protecciones y repuestos
- Los productos tienen variantes (tallas) con stock propio
- Inventario de un aliado con tienda física en Bogotá
- Textos de la tienda en español (precios en COP)

## Comandos

- `docker compose up -d` — levanta PostgreSQL (variables `DB_USER`, `DB_NAME`, `DB_PASSWORD` en `.env`)
- `npx prisma migrate dev --name <nombre>` — crea y aplica una migración tras cambiar `prisma/schema.prisma`
- `npm run seed` — carga datos de prueba (`prisma/seed.ts`)
- `npm run dev` — servidor de desarrollo
- `npm run lint` — revisar antes de terminar cualquier cambio

## Estructura

- `prisma/schema.prisma` — modelos; el cliente se genera en `src/generated` (no editar a mano)
- `src/actions/` — server actions por dominio (`products`, `order`, `payments`, ...)
- `src/app/(shop)/` — páginas de la tienda y del admin (`admin/`)
- `src/components/`, `src/store/` (Zustand: carrito, dirección, UI), `src/interfaces/`

## Estado actual del modelo (heredado de Teslo)

- `Product` todavía tiene un solo `inStock` y `sizes Size[]` con tallas de ropa (XS…XXXL).
- Aún NO existe stock por talla; hay que migrar a un modelo de variantes
  (p. ej. `ProductVariant { productId, size, stock }`) y adaptar carrito, órdenes y admin.
- Las tallas de patines/protecciones no son de ropa (ej. 35–45, S/M/L de protecciones):
  revisar el enum `Size` antes de crear productos nuevos.

## Convenciones

- Toda la UI y mensajes al usuario en español.
- No subir `.env` ni secretos.
- Al descontar stock en una orden, hacerlo dentro de una transacción de Prisma.
