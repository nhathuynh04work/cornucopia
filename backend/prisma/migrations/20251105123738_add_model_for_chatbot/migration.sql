/*
  Warnings:

  - Made the column `tsv` on table `post_chunks` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "public"."idx_post_chunks_tsv";

-- AlterTable
ALTER TABLE "post_chunks" ALTER COLUMN "tsv" SET NOT NULL;
