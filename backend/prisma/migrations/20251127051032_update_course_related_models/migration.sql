/*
  Warnings:

  - The values [UNLISTED] on the enum `CourseStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `name` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `lessons` table. All the data in the column will be lost.
  - You are about to drop the column `text_content` on the `lessons` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `modules` table. All the data in the column will be lost.
  - Added the required column `title` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Made the column `type` on table `lessons` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sort_order` on table `lessons` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sort_order` on table `modules` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CourseStatus_new" AS ENUM ('DRAFT', 'PUBLIC', 'ARCHIVED');
ALTER TABLE "public"."courses" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "courses" ALTER COLUMN "status" TYPE "CourseStatus_new" USING ("status"::text::"CourseStatus_new");
ALTER TYPE "CourseStatus" RENAME TO "CourseStatus_old";
ALTER TYPE "CourseStatus_new" RENAME TO "CourseStatus";
DROP TYPE "public"."CourseStatus_old";
ALTER TABLE "courses" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- DropIndex
DROP INDEX "lessons_status_idx";

-- DropIndex
DROP INDEX "modules_status_idx";

-- DropIndex
DROP INDEX "test_chunks_tsv_idx";

-- AlterTable
ALTER TABLE "courses" DROP COLUMN "name",
ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "price" SET DEFAULT 100000;

-- AlterTable
ALTER TABLE "lessons" DROP COLUMN "status",
DROP COLUMN "text_content",
ADD COLUMN     "html_content" TEXT,
ADD COLUMN     "is_published" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "type" SET NOT NULL,
ALTER COLUMN "type" SET DEFAULT 'VIDEO',
ALTER COLUMN "sort_order" SET NOT NULL;

-- AlterTable
ALTER TABLE "modules" DROP COLUMN "status",
ALTER COLUMN "sort_order" SET NOT NULL;

-- DropEnum
DROP TYPE "ContentStatus";

-- CreateIndex
CREATE INDEX "lessons_module_id_idx" ON "lessons"("module_id");

-- AddForeignKey
ALTER TABLE "course_chunks" ADD CONSTRAINT "course_chunks_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_chunks" ADD CONSTRAINT "course_chunks_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
