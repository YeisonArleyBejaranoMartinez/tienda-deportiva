# Descripción

ecomerce para la venta de productos ganardores inovadores y en tendencia.

## correr en dev

1. Clonar el repocitorio.`git clone nombre_del_proyecto`
2. Crear una copia del `.env.template ` y renombrarlo a `.env` y cambiar las variables de entorno
3. Instalar dependencias `npm install`.
4. Levantar la base de datos `docker compose up -d`
5. correr las migraciones de prisma `npx prisma migrate dev`
6. correr el proyecto `npm run dev`

## Correr en prod

1. correr el comando `npm run build`
