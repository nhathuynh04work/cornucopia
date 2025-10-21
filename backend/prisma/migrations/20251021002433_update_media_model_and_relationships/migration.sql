/*
  Warnings:

  - You are about to drop the column `status` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `media` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[s3_key]` on the table `media` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."media" DROP CONSTRAINT "media_user_id_fkey";

-- AlterTable
ALTER TABLE "media" DROP COLUMN "status",
DROP COLUMN "user_id",
ADD COLUMN     "test_id" INTEGER,
ADD COLUMN     "test_item_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "media_s3_key_key" ON "media"("s3_key");

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_test_item_id_fkey" FOREIGN KEY ("test_item_id") REFERENCES "test_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
