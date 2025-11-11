-- Bật extension (nếu chưa có)
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Thêm cột tsv (bình thường, không GENERATED)
ALTER TABLE post_chunks
  ADD COLUMN IF NOT EXISTS tsv tsvector;

-- Backfill dữ liệu cũ
UPDATE post_chunks
SET tsv = to_tsvector('simple', unaccent(coalesce(content, '')));

-- Trigger: tự cập nhật tsv khi INSERT/UPDATE
CREATE OR REPLACE FUNCTION post_chunks_tsv_trigger() RETURNS trigger AS $$
BEGIN
  NEW.tsv := to_tsvector('simple', unaccent(coalesce(NEW.content, '')));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS post_chunks_tsv_update ON post_chunks;
CREATE TRIGGER post_chunks_tsv_update
BEFORE INSERT OR UPDATE ON post_chunks
FOR EACH ROW EXECUTE PROCEDURE post_chunks_tsv_trigger();

-- Index GIN cho full-text search
CREATE INDEX IF NOT EXISTS idx_post_chunks_tsv
  ON post_chunks USING GIN (tsv);
