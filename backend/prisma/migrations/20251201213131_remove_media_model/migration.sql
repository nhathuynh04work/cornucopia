/*
  Warnings:

  - You are about to drop the `media` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "media" DROP CONSTRAINT "media_post_id_fkey";

-- DropForeignKey
ALTER TABLE "media" DROP CONSTRAINT "media_test_item_id_fkey";

-- AlterTable
ALTER TABLE "test_items" ADD COLUMN     "media_urls" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- DropTable
DROP TABLE "media";
