/*
  Warnings:

  - You are about to drop the column `media_url` on the `test_items` table. All the data in the column will be lost.
  - You are about to drop the column `section_id` on the `test_items` table. All the data in the column will be lost.
  - You are about to drop the `test_sections` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `test_id` to the `test_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."test_items" DROP CONSTRAINT "test_items_section_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."test_sections" DROP CONSTRAINT "test_sections_test_id_fkey";

-- AlterTable
ALTER TABLE "test_items" DROP COLUMN "media_url",
DROP COLUMN "section_id",
ADD COLUMN     "test_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."test_sections";

-- AddForeignKey
ALTER TABLE "test_items" ADD CONSTRAINT "test_items_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 1. DROP UNNECESSARY SECTION TRIGGER
DROP TRIGGER IF EXISTS trg_set_section_sort_order ON test_sections;
DROP FUNCTION IF EXISTS fn_set_section_sort_order();

-------------------------------------------------------------------------------------------

-- 2. SORT ORDER FOR A NEW ITEM (UPDATED)
CREATE OR REPLACE FUNCTION fn_set_item_sort_order()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.parent_item_id IS NOT NULL THEN
        -- Item is a child; sort among its siblings.
        SELECT COALESCE(MAX(sort_order), 0) + 1
        INTO NEW.sort_order
        FROM test_items
        WHERE parent_item_id = NEW.parent_item_id;
    ELSE
        -- Item is top-level; sort within its test among other top-level items.
        SELECT COALESCE(MAX(sort_order), 0) + 1
        INTO NEW.sort_order
        FROM test_items
        WHERE test_id = NEW.test_id AND parent_item_id IS NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_item_sort_order ON test_items;

CREATE TRIGGER trg_set_item_sort_order
    BEFORE INSERT ON test_items
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_item_sort_order();

-------------------------------------------------------------------------------------------

-- 3. SORT ORDER FOR A NEW ANSWER OPTION (NO CHANGE NEEDED)
CREATE OR REPLACE FUNCTION fn_set_option_sort_order()
RETURNS TRIGGER AS $$
BEGIN
    SELECT COALESCE(MAX(sort_order), 0) + 1
    INTO NEW.sort_order
    FROM answer_options
    WHERE item_id = NEW.item_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_option_sort_order ON answer_options;
CREATE TRIGGER trg_set_option_sort_order
    BEFORE INSERT ON answer_options
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_option_sort_order();
