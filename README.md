# Tienda deportiva

E-commerce de patines, patinetas, protecciones y repuestos (base: Teslo Shop).

La app y la base de datos corren en contenedores separados:

| Servicio  | Qué hace                                             |
|-----------|------------------------------------------------------|
| `db`      | PostgreSQL (datos guardados en `./postgres`)          |
| `migrate` | Aplica las migraciones de Prisma y termina            |
| `app`     | Next.js en modo producción en http://localhost:3000   |

## Configuración

1. Clonar el repositorio.
2. Copiar `.env.template` a `.env` y completar las variables.
3. Generar `AUTH_SECRET` con `npx auth secret`.

## Correr en desarrollo (solo la base en Docker)

1. `npm install`
2. `docker compose up -d db`
3. `npx prisma migrate dev`
4. `npm run seed` (opcional, datos de prueba)
5. `npm run dev`

## Correr todo en Docker (producción)

1. `docker compose --profile app up -d --build`
2. Datos de prueba (opcional):
   `docker compose --profile app run --rm migrate npm run seed`

Para detener: `docker compose --profile app down`
