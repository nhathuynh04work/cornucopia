/*
  Warnings:

  - You are about to alter the column `points` on the `test_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `Integer`.
  - Made the column `answer_time` on table `session_answers` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "attempts" ADD COLUMN     "correct_count" INTEGER,
ADD COLUMN     "scored_points" INTEGER,
ADD COLUMN     "total_possible_points" INTEGER,
ADD COLUMN     "unanswered_count" INTEGER,
ADD COLUMN     "wrong_count" INTEGER;

-- AlterTable
ALTER TABLE "session_answers" ALTER COLUMN "answer_time" SET NOT NULL,
ALTER COLUMN "answer_time" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "test_items" ALTER COLUMN "points" SET DEFAULT 1,
ALTER COLUMN "points" SET DATA TYPE INTEGER;
