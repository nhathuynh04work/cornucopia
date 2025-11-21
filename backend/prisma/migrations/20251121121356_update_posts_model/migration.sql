/*
  Warnings:

  - You are about to drop the column `slug` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `tags` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `tags` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."posts_slug_key";

-- DropIndex
DROP INDEX "public"."tags_slug_key";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "slug",
ADD COLUMN     "excerpt" TEXT;

-- AlterTable
ALTER TABLE "tags" DROP COLUMN "description",
DROP COLUMN "slug";
