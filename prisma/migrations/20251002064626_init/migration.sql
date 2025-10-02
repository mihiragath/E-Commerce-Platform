/*
  Warnings:

  - You are about to drop the column `quantity` on the `Cart` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Cart_userId_productId_key";

-- AlterTable
ALTER TABLE "public"."Cart" DROP COLUMN "quantity";

-- CreateIndex
CREATE INDEX "Cart_userId_idx" ON "public"."Cart"("userId");

-- CreateIndex
CREATE INDEX "Cart_productId_idx" ON "public"."Cart"("productId");
