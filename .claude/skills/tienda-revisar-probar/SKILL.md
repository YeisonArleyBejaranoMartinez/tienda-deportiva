---
name: tienda-revisar-probar
description: Usar antes de hacer commit o abrir un PR en la tienda deportiva: lint, tipos, build, prueba manual del flujo de compra y revisión de código.
---

# Revisar y probar antes de cada PR

El proyecto aún no tiene suite de tests automatizados. Hasta que exista, esta es la puerta de calidad mínima. Seguir los pasos en orden y no abrir el PR si alguno falla.

## 1. Verificaciones automáticas

```bash
npm run lint            # ESLint (next core-web-vitals + typescript)
npx tsc --noEmit        # tipos
npx prisma validate     # si se tocó prisma/schema.prisma
npx next build          # build sin migrar (npm run build también aplica migraciones)
```

- Si `lint` o `tsc` fallan, corregir y re-ejecutar solo ese comando.
- Si se tocó el schema: confirmar que existe la migración nueva en `prisma/migrations/` y que `npx prisma migrate dev` corre limpio sobre una base recién levantada (`docker compose up -d db`, luego `npm run seed`).

## 2. Prueba manual del flujo crítico

Con `docker compose up -d db`, `npm run seed` y `npm run dev`, probar lo que el cambio toca:

- Catálogo: listado, filtro por categoría/género, paginación.
- Producto: selector de talla, stock por talla, agregar al carrito.
- Carrito: cambiar cantidades, quitar, totales en COP; recargar la página y ver que persiste.
- Checkout: login, dirección, crear orden. Verificar en la base que el stock de la talla bajó exactamente lo comprado y que no queda negativo.
- Comprar más unidades que el stock disponible debe fallar con un mensaje en español y sin crear la orden.
- Admin: crear/editar producto y sus tallas, ver órdenes y usuarios; un usuario sin rol admin no debe entrar.
- Revisar en móvil (360px) y escritorio, y que la consola del navegador no tenga errores de hidratación.

## 3. Revisión de código (checklist)

- [ ] Descuento de stock dentro de `prisma.$transaction` usando `tx`, sin posibilidad de stock negativo.
- [ ] Precios y totales calculados en el servidor desde la base, no desde el cliente.
- [ ] Server actions validan con Zod y autorizan por `session.user.role` / dueño del recurso.
- [ ] Nada de comparaciones que siempre son verdaderas (p. ej. `p.slug === p.slug`) ni chequeos de rol contra el campo equivocado (`user.id === "user"`).
- [ ] Tipos explícitos: sin `any` ni parámetros sin tipo.
- [ ] Textos y mensajes al usuario en español; precios con `currencyFormat`.
- [ ] `"use client"` solo donde hace falta.
- [ ] Sin `console.log` de depuración ni código comentado nuevo.
- [ ] Sin `.env`, claves de Cloudinary/PayPal ni `AUTH_SECRET` en el diff (`git diff --cached | grep -iE "secret|key|password"`).
- [ ] `src/generated/` no se editó a mano.

## 4. Abrir el PR

- Rama descriptiva y commits pequeños con mensajes en español.
- Descripción del PR: qué cambia, por qué, cómo se probó (lista de los pasos del punto 2 que se hicieron), migraciones incluidas y capturas si cambia la UI.
- Si se agregan tests en el futuro (recomendado: Vitest para lógica de carrito/órdenes y Playwright para el flujo de compra), añadir aquí `npm test` como paso obligatorio.
