/*
  Warnings:

  - You are about to drop the column `dueDate` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Product` table. All the data in the column will be lost.
  - Added the required column `price` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellerId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_userId_fkey";

-- First, let's store the existing userId values to use them as sellerIds
CREATE TEMP TABLE temp_products AS
SELECT id, "userId" FROM "Product";

-- Now get a valid user ID to use as a default in case we need it
DO $$
DECLARE
    default_user_id TEXT;
BEGIN
    SELECT id INTO default_user_id FROM "User" LIMIT 1;
    
    IF default_user_id IS NULL THEN
        -- If no user exists, create a system user
        INSERT INTO "User" (id, "createdAt", "updatedAt", email, pass)
        VALUES (gen_random_uuid(), NOW(), NOW(), 'system@example.com', 'system_password')
        RETURNING id INTO default_user_id;
    END IF;

    -- AlterTable
    ALTER TABLE "Product" DROP COLUMN "dueDate",
    DROP COLUMN "userId",
    ADD COLUMN     "buyerId" TEXT,
    ADD COLUMN     "category" TEXT,
    ADD COLUMN     "discount" DOUBLE PRECISION,
    ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN     "isSold" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN     "price" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    ADD COLUMN     "rating" DOUBLE PRECISION,
    ADD COLUMN     "sellerId" TEXT NOT NULL DEFAULT default_user_id,
    ADD COLUMN     "soldAt" TIMESTAMP(3),
    ADD COLUMN     "specifications" JSONB,
    ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
    
    -- Now update the sellerId with the original userId for each product
    UPDATE "Product" p
    SET "sellerId" = tp."userId"
    FROM temp_products tp
    WHERE p.id = tp.id;
END $$;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
