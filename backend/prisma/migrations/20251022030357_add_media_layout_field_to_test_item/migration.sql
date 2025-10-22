-- CreateEnum
CREATE TYPE "TestItemMediaLayout" AS ENUM ('FULL_WIDTH_STACKED', 'LEFT_STACKED', 'TEXT_TOP_MEDIA_LEFT');

-- AlterTable
ALTER TABLE "test_items" ADD COLUMN     "media_layout" "TestItemMediaLayout" NOT NULL DEFAULT 'FULL_WIDTH_STACKED';
