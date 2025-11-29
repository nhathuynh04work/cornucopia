-- AlterTable
ALTER TABLE "tests" ADD COLUMN     "attempts_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "level" "Level" NOT NULL DEFAULT 'ALL_LEVELS',
ADD COLUMN     "questions_count" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "tests_status_idx" ON "tests"("status");

-- CreateIndex
CREATE INDEX "tests_level_idx" ON "tests"("level");

-- CreateIndex
CREATE INDEX "tests_attempts_count_idx" ON "tests"("attempts_count");
