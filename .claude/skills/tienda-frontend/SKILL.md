---
name: tienda-frontend
description: Usar al crear o cambiar páginas, componentes, estilos o stores de Zustand en la tienda deportiva (Next.js 16, React 19, Tailwind 4).
---

# Frontend de la tienda deportiva

Stack: Next.js 16 App Router, React 19, Tailwind CSS 4 (`@import "tailwindcss"` en `src/app/globals.css`), Zustand 5 con `persist`, react-hook-form + Zod, react-icons, Swiper, clsx, `next/image`.

Tienda de patines, patinetas, protecciones y repuestos de un aliado con tienda física en Bogotá. Toda la UI en español y precios en COP.

## Estructura

- `src/app/(shop)/...`: páginas de la tienda y del admin (`admin/`). Cada página es Server Component por defecto; las partes interactivas van en una carpeta `ui/` junto a la página (`product/[slug]/ui/AddToCart.tsx`).
- `src/components/<area>/<componente>/Componente.tsx`: componentes reutilizables, en PascalCase, exportados con named export y re-exportados en `src/components/index.ts`.
- `src/store/<dominio>/<dominio>-store.ts`: stores de Zustand (carrito, dirección, UI), exportados en `src/store/index.ts`.
- `src/interfaces/`: tipos compartidos. `src/app/utils/`: helpers (`currencyFormat`, paginación).
- Fuentes en `src/confic/fonts.ts` (`titleFont` para títulos, Geist para texto).

## Reglas de componentes

- Server Component por defecto. Agregar `"use client"` solo si usa estado, efectos, eventos, stores de Zustand o librerías de animación. Mantener los client components pequeños y pasarles datos ya cargados desde el servidor.
- Datos: leer con server actions de `@/src/actions` desde Server Components; mutar con server actions desde formularios o handlers.
- En Next.js 16 `params` y `searchParams` son `Promise`: tiparlos como `Promise<{ slug: string }>` y hacer `await`.
- Componentes con Zustand + `persist`: evitar errores de hidratación esperando a montar (`const [loaded, setLoaded] = useState(false); useEffect(() => setLoaded(true), [])`) antes de mostrar valores del store.
- Props con interfaz `Props` tipada; nombres de props en camelCase.
- Clases condicionales con `clsx`. Nada de estilos inline salvo valores dinámicos.
- Imágenes con `next/image` (con `alt` descriptivo en español y `width`/`height` o `fill` + `sizes`).
- Iconos de `react-icons` (preferir un solo set, p. ej. `io5`).
- Formularios con `react-hook-form`; mostrar errores en español debajo del campo.

## Estilo visual

- Tailwind 4 utilitario; color de marca en `--primary` (`#274494`) de `globals.css`. Para nuevos tokens, declararlos en `@theme` dentro de `globals.css` en vez de valores sueltos.
- Mobile first: diseñar para 360px y escalar con `sm: md: lg:`. Grillas de productos `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`.
- Botones: reutilizar las clases existentes `btn-primary` / `btn-secondary` si están en `globals.css`; estados `hover:`, `focus-visible:` y `disabled:` siempre.
- Precios siempre con `currencyFormat` (COP, sin decimales), nunca `${product.price}` crudo.
- Selector de talla: mostrar tallas sin stock deshabilitadas (tachadas o en gris) y la etiqueta de stock (`StockLabel`) por talla cuando exista `ProductVariant`.

## Accesibilidad y textos

- `lang="es"` en el `<html>` del layout raíz.
- Botones con texto o `aria-label` en español; foco visible; contraste AA.
- Metadatos (`metadata` / `generateMetadata`) en español y con datos reales del producto (no APIs de ejemplo).
- Tallas: patines 35–45, protecciones S/M/L, patinetas y repuestos talla única; no mostrar tallas de ropa XS…XXXL en productos que no las usen.

## Antes de terminar

- `npm run lint` sin errores.
- Revisar la página en móvil y escritorio con `npm run dev`.
