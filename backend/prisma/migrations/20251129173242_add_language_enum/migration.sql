/*
  Warnings:

  - The `language` column on the `courses` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `language` column on the `decks` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `language` column on the `tests` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ContentLanguage" AS ENUM ('en', 'ja', 'ko', 'zh', 'fr', 'es');

-- AlterTable
ALTER TABLE "courses" DROP COLUMN "language",
ADD COLUMN     "language" "ContentLanguage" NOT NULL DEFAULT 'en';

-- AlterTable
ALTER TABLE "decks" DROP COLUMN "language",
ADD COLUMN     "language" "ContentLanguage" NOT NULL DEFAULT 'en';

-- AlterTable
ALTER TABLE "tests" DROP COLUMN "language",
ADD COLUMN     "language" "ContentLanguage" NOT NULL DEFAULT 'en';

-- CreateIndex
CREATE INDEX "decks_language_idx" ON "decks"("language");

-- CreateIndex
CREATE INDEX "tests_language_idx" ON "tests"("language");
