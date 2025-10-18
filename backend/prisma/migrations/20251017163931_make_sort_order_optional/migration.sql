-- AlterTable
ALTER TABLE "answer_options" ALTER COLUMN "sort_order" DROP NOT NULL;

-- AlterTable
ALTER TABLE "test_items" ALTER COLUMN "sort_order" DROP NOT NULL;

-- AlterTable
ALTER TABLE "test_sections" ALTER COLUMN "sort_order" DROP NOT NULL;
