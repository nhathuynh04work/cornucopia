/*
  Warnings:

  - Made the column `time_limit` on table `tests` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "tests" ALTER COLUMN "time_limit" SET NOT NULL,
ALTER COLUMN "time_limit" SET DEFAULT 1800;
