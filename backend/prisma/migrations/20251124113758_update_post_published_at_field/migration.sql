/*
  Warnings:

  - Made the column `published_at` on table `posts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "published_at" SET NOT NULL;
