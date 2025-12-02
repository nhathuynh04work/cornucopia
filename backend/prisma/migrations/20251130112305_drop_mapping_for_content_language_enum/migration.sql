/*
  Warnings:

  - The values [en,ja,ko,zh,fr,es] on the enum `ContentLanguage` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ContentLanguage_new" AS ENUM ('ENGLISH', 'JAPANESE', 'KOREAN', 'CHINESE', 'FRENCH', 'SPANISH');
ALTER TABLE "public"."courses" ALTER COLUMN "language" DROP DEFAULT;
ALTER TABLE "public"."decks" ALTER COLUMN "language" DROP DEFAULT;
ALTER TABLE "public"."tests" ALTER COLUMN "language" DROP DEFAULT;
ALTER TABLE "tests" ALTER COLUMN "language" TYPE "ContentLanguage_new" USING ("language"::text::"ContentLanguage_new");
ALTER TABLE "decks" ALTER COLUMN "language" TYPE "ContentLanguage_new" USING ("language"::text::"ContentLanguage_new");
ALTER TABLE "courses" ALTER COLUMN "language" TYPE "ContentLanguage_new" USING ("language"::text::"ContentLanguage_new");
ALTER TYPE "ContentLanguage" RENAME TO "ContentLanguage_old";
ALTER TYPE "ContentLanguage_new" RENAME TO "ContentLanguage";
DROP TYPE "public"."ContentLanguage_old";
ALTER TABLE "courses" ALTER COLUMN "language" SET DEFAULT 'ENGLISH';
ALTER TABLE "decks" ALTER COLUMN "language" SET DEFAULT 'ENGLISH';
ALTER TABLE "tests" ALTER COLUMN "language" SET DEFAULT 'ENGLISH';
COMMIT;

-- AlterTable
ALTER TABLE "courses" ALTER COLUMN "language" SET DEFAULT 'ENGLISH';

-- AlterTable
ALTER TABLE "decks" ALTER COLUMN "language" SET DEFAULT 'ENGLISH';

-- AlterTable
ALTER TABLE "tests" ALTER COLUMN "language" SET DEFAULT 'ENGLISH';
