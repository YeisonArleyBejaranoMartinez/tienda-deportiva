-- Stock por talla: cada producto tiene variantes (talla + stock).

-- 1. Nueva tabla de variantes
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "productId" TEXT NOT NULL,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProductVariant_productId_size_key" ON "ProductVariant"("productId", "size");

ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 2. Pasar los datos existentes: una variante por cada talla del producto.
--    Antes el stock era uno solo para todas las tallas; se copia a cada talla
--    y hay que revisarlo en el admin. Productos sin tallas quedan con "Única".
INSERT INTO "ProductVariant" ("id", "size", "stock", "productId")
SELECT gen_random_uuid()::text, s::text, p."inStock", p."id"
FROM "Product" p, unnest(p."sizes") AS s;

INSERT INTO "ProductVariant" ("id", "size", "stock", "productId")
SELECT gen_random_uuid()::text, 'Única', p."inStock", p."id"
FROM "Product" p
WHERE cardinality(p."sizes") = 0;

-- 3. La talla de los items de órdenes pasa de enum a texto (se conservan los datos)
ALTER TABLE "OrderItem" ALTER COLUMN "size" TYPE TEXT USING "size"::text;

-- 4. Quitar columnas y enum viejos
ALTER TABLE "Product" DROP COLUMN "inStock",
DROP COLUMN "sizes";

DROP TYPE "Size";
