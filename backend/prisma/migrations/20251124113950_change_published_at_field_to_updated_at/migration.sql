/*
  Warnings:

  - You are about to drop the column `published_at` on the `posts` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "published_at",
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL;
