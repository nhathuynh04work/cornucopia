-- CreateTable
CREATE TABLE "course_chunks" (
    "id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "module_id" INTEGER,
    "lesson_id" INTEGER,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tsv" tsvector NOT NULL,

    CONSTRAINT "course_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "course_chunks_course_id_idx" ON "course_chunks"("course_id");

-- CreateIndex
CREATE INDEX "course_chunks_lesson_id_idx" ON "course_chunks"("lesson_id");

-- Bật extension (nếu chưa có)
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Fill tsv cho các hàng đã có 
UPDATE course_chunks
SET tsv = to_tsvector('simple', unaccent(coalesce(content, '')));

-- Trigger function cập nhật tsv trước INSERT/UPDATE
CREATE OR REPLACE FUNCTION trg_course_chunks_tsv() RETURNS trigger AS $$
BEGIN
  NEW.tsv := to_tsvector('simple', unaccent(coalesce(NEW.content, '')));
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- Gắn trigger
DROP TRIGGER IF EXISTS tsv_course_chunks ON course_chunks;
CREATE TRIGGER tsv_course_chunks
BEFORE INSERT OR UPDATE ON course_chunks
FOR EACH ROW EXECUTE PROCEDURE trg_course_chunks_tsv();

-- Index GIN cho truy vấn full-text
CREATE INDEX IF NOT EXISTS idx_course_chunks_tsv    ON course_chunks USING GIN (tsv);

-- đảm bảo index theo FK
CREATE INDEX IF NOT EXISTS idx_course_chunks_course ON course_chunks(course_id);
CREATE INDEX IF NOT EXISTS idx_course_chunks_lesson ON course_chunks(lesson_id);
