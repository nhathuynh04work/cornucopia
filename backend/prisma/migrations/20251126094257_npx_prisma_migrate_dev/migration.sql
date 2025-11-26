/*
  Warnings:

  - Made the column `is_correct` on table `answer_options` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sort_order` on table `answer_options` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sort_order` on table `test_items` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "answer_options" ALTER COLUMN "is_correct" SET NOT NULL,
ALTER COLUMN "sort_order" SET NOT NULL;

-- AlterTable
ALTER TABLE "test_items" ALTER COLUMN "sort_order" SET NOT NULL;
