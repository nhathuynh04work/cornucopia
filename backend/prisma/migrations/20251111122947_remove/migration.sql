/*
  Warnings:

  - Made the column `title` on table `flashcard_lists` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "public"."uq_user_title";

-- AlterTable
ALTER TABLE "flashcard_lists" ALTER COLUMN "title" SET NOT NULL;
