-- AlterTable
ALTER TABLE "public"."answer_options" ALTER COLUMN "text" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."test_sections" ALTER COLUMN "title" DROP NOT NULL;
