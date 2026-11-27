-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "originalPrice" DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "Product_featured_idx" ON "Product"("featured");
