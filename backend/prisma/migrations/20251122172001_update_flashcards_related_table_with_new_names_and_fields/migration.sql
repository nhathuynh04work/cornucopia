/*
  Warnings:

  - You are about to drop the column `list_id` on the `study_sessions` table. All the data in the column will be lost.
  - You are about to drop the `flashcard_lists` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `flashcards` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `session_answers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `deck_id` to the `study_sessions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "flashcard_lists" DROP CONSTRAINT "flashcard_lists_user_id_fkey";

-- DropForeignKey
ALTER TABLE "flashcards" DROP CONSTRAINT "flashcards_list_id_fkey";

-- DropForeignKey
ALTER TABLE "session_answers" DROP CONSTRAINT "session_answers_flashcard_id_fkey";

-- DropForeignKey
ALTER TABLE "session_answers" DROP CONSTRAINT "session_answers_session_id_fkey";

-- DropForeignKey
ALTER TABLE "study_sessions" DROP CONSTRAINT "study_sessions_list_id_fkey";

-- AlterTable
ALTER TABLE "study_sessions" DROP COLUMN "list_id",
ADD COLUMN     "deck_id" INTEGER NOT NULL,
ALTER COLUMN "start_time" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "flashcard_lists";

-- DropTable
DROP TABLE "flashcards";

-- DropTable
DROP TABLE "session_answers";

-- CreateTable
CREATE TABLE "decks" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "decks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cards" (
    "id" SERIAL NOT NULL,
    "deck_id" INTEGER NOT NULL,
    "term" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "card_attempts" (
    "id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "card_id" INTEGER NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "card_attempts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "decks" ADD CONSTRAINT "decks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_deck_id_fkey" FOREIGN KEY ("deck_id") REFERENCES "decks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_deck_id_fkey" FOREIGN KEY ("deck_id") REFERENCES "decks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_attempts" ADD CONSTRAINT "card_attempts_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "study_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_attempts" ADD CONSTRAINT "card_attempts_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
