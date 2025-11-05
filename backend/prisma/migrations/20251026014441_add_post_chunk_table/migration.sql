/*
  Warnings:

  - Made the column `answer_time` on table `session_answers` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "session_answers" ALTER COLUMN "answer_time" SET NOT NULL,
ALTER COLUMN "answer_time" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "post_chunks" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "post_chunks_post_id_idx" ON "post_chunks"("post_id");

-- AddForeignKey
ALTER TABLE "post_chunks" ADD CONSTRAINT "post_chunks_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
