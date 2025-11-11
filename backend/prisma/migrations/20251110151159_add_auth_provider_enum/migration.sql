/*
  Warnings:

  - Changed the type of `provider` on the `authentication` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('LOCAL', 'GOOGLE');

-- AlterTable
ALTER TABLE "authentication" DROP COLUMN "provider",
ADD COLUMN     "provider" "Provider" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "authentication_provider_provider_id" ON "authentication"("provider", "provider_id");

-- CreateIndex
CREATE UNIQUE INDEX "authentication_provider_user_id" ON "authentication"("provider", "user_id");
