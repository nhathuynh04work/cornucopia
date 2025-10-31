-- AlterTable
ALTER TABLE "lessons" ADD COLUMN     "text_content" TEXT,
ALTER COLUMN "type" DROP NOT NULL;
