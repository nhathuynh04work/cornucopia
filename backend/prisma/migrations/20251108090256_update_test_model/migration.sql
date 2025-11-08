/*
  Warnings:

  - Added the required column `userId` to the `tests` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TestStatus" AS ENUM ('DRAFT', 'PUBLIC', 'ARCHIVED');

-- AlterTable
ALTER TABLE "tests" ADD COLUMN     "status" "TestStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "tests" ADD CONSTRAINT "tests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
