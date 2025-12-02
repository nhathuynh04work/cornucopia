-- CreateTable
CREATE TABLE "test_chunks" (
    "id" SERIAL NOT NULL,
    "test_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tsv" tsvector,

    CONSTRAINT "test_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "test_chunks_test_id_idx" ON "test_chunks"("test_id");

-- AddForeignKey
ALTER TABLE "test_chunks" ADD CONSTRAINT "test_chunks_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- function tạo tsv từ content
CREATE FUNCTION test_chunks_tsv_trigger() RETURNS trigger AS $$
BEGIN
  NEW.tsv := to_tsvector(
    'simple',
    unaccent(coalesce(NEW.content, ''))
  );
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- trigger trước insert/update
CREATE TRIGGER test_chunks_tsv
BEFORE INSERT OR UPDATE ON test_chunks
FOR EACH ROW EXECUTE FUNCTION test_chunks_tsv_trigger();

-- index GIN cho FTS
CREATE INDEX test_chunks_tsv_idx ON test_chunks USING GIN (tsv);