/*
  Warnings:

  - You are about to drop the column `description` on the `flashcard_lists` table. All the data in the column will be lost.
  - You are about to drop the column `example` on the `flashcards` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `flashcards` table. All the data in the column will be lost.
  - You are about to drop the column `answer_time` on the `session_answers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "flashcard_lists" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "flashcards" DROP COLUMN "example",
DROP COLUMN "image_url";

-- AlterTable
ALTER TABLE "session_answers" DROP COLUMN "answer_time";
