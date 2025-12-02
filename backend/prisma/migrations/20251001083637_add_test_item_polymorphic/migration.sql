/*
  Warnings:

  - You are about to drop the column `question_id` on the `answer_options` table. All the data in the column will be lost.
  - You are about to drop the `question_groups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `questions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `item_id` to the `answer_options` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."enum_test_items_type" AS ENUM ('group', 'question', 'instruction', 'media');

-- CreateEnum
CREATE TYPE "public"."enum_test_items_question_type" AS ENUM ('multiple_choice', 'short_answer', 'true_false', 'matching');

-- DropForeignKey
ALTER TABLE "public"."answer_options" DROP CONSTRAINT "answer_options_question_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."question_groups" DROP CONSTRAINT "question_groups_section_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."questions" DROP CONSTRAINT "questions_group_id_fkey";

-- AlterTable
ALTER TABLE "public"."answer_options" DROP COLUMN "question_id",
ADD COLUMN     "item_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."question_groups";

-- DropTable
DROP TABLE "public"."questions";

-- DropEnum
DROP TYPE "public"."enum_questions_question_type";

-- CreateTable
CREATE TABLE "public"."test_items" (
    "id" SERIAL NOT NULL,
    "section_id" INTEGER NOT NULL,
    "parent_item_id" INTEGER,
    "type" "public"."enum_test_items_type" NOT NULL,
    "title" TEXT,
    "text" TEXT,
    "media_url" TEXT,
    "question_type" "public"."enum_test_items_question_type",
    "points" DECIMAL(5,2) DEFAULT 1,
    "sort_order" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."test_items" ADD CONSTRAINT "test_items_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "public"."test_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."test_items" ADD CONSTRAINT "test_items_parent_item_id_fkey" FOREIGN KEY ("parent_item_id") REFERENCES "public"."test_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."answer_options" ADD CONSTRAINT "answer_options_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."test_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
