/*
  Warnings:

  - The values [question,instruction,media] on the enum `enum_test_items_type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `question_type` on the `test_items` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "enum_test_items_type_new" AS ENUM ('group', 'multiple_choice', 'short_answer');
ALTER TABLE "test_items" ALTER COLUMN "type" TYPE "enum_test_items_type_new" USING ("type"::text::"enum_test_items_type_new");
ALTER TYPE "enum_test_items_type" RENAME TO "enum_test_items_type_old";
ALTER TYPE "enum_test_items_type_new" RENAME TO "enum_test_items_type";
DROP TYPE "public"."enum_test_items_type_old";
COMMIT;

-- AlterTable
ALTER TABLE "test_items" DROP COLUMN "question_type";

-- DropEnum
DROP TYPE "public"."enum_test_items_question_type";
