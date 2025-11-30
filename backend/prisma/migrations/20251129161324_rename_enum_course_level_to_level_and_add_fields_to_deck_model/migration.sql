/*
  Warnings:

  - The `level` column on the `courses` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Level" AS ENUM ('ALL_LEVELS', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- AlterTable
ALTER TABLE "courses" DROP COLUMN "level",
ADD COLUMN     "level" "Level" NOT NULL DEFAULT 'ALL_LEVELS';

-- AlterTable
ALTER TABLE "decks" ADD COLUMN     "cards_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "level" "Level" NOT NULL DEFAULT 'ALL_LEVELS',
ADD COLUMN     "study_session_count" INTEGER NOT NULL DEFAULT 0;

-- DropEnum
DROP TYPE "CourseLevel";

-- CreateIndex
CREATE INDEX "decks_is_public_idx" ON "decks"("is_public");

-- CreateIndex
CREATE INDEX "decks_level_idx" ON "decks"("level");

-- CreateIndex
CREATE INDEX "decks_language_idx" ON "decks"("language");

-- CreateIndex
CREATE INDEX "decks_study_session_count_idx" ON "decks"("study_session_count");
