-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "average_rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "rating_count" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "courses_average_rating_idx" ON "courses"("average_rating");

-- CreateIndex
CREATE INDEX "courses_price_idx" ON "courses"("price");
