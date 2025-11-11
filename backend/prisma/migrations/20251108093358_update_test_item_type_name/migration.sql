/*
  Warnings:

  - The values [group,multiple_choice,short_answer] on the enum `enum_test_items_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "enum_test_items_type_new" AS ENUM ('GROUP', 'MULTIPLE_CHOICE', 'SHORT_ANSWER');
ALTER TABLE "test_items" ALTER COLUMN "type" TYPE "enum_test_items_type_new" USING ("type"::text::"enum_test_items_type_new");
ALTER TYPE "enum_test_items_type" RENAME TO "enum_test_items_type_old";
ALTER TYPE "enum_test_items_type_new" RENAME TO "enum_test_items_type";
DROP TYPE "public"."enum_test_items_type_old";
COMMIT;
