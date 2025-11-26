/*
  Warnings:

  - You are about to drop the column `test_id` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `allow_multiple_correct` on the `test_items` table. All the data in the column will be lost.
  - You are about to drop the column `media_layout` on the `test_items` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "media" DROP CONSTRAINT "media_test_id_fkey";

-- AlterTable
ALTER TABLE "media" DROP COLUMN "test_id";

-- AlterTable
ALTER TABLE "test_items" DROP COLUMN "allow_multiple_correct",
DROP COLUMN "media_layout";

-- AlterTable
ALTER TABLE "tests" ADD COLUMN     "audio_url" TEXT;

-- DropEnum
DROP TYPE "TestItemMediaLayout";
