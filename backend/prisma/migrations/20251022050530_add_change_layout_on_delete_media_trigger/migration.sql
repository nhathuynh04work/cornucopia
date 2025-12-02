-- 1. Create the trigger function
CREATE OR REPLACE FUNCTION fn_reset_media_layout()
RETURNS TRIGGER AS $$
DECLARE
    media_count INTEGER;
    v_test_item_id INTEGER;
BEGIN
    -- This function fires *after* a row is deleted from the "media" table.
    -- OLD."test_item_id" is the ID of the TestItem that was just unlinked.
    v_test_item_id := OLD."test_item_id";

    -- Only proceed if the media was actually linked to a TestItem
    IF v_test_item_id IS NOT NULL THEN
        -- Count how many media items are *still* linked to this TestItem
        SELECT COUNT(*)
        INTO media_count
        FROM "media"
        WHERE "test_item_id" = v_test_item_id;

        -- If the count is 0, this was the last media item.
        IF media_count = 0 THEN
            -- Reset the media_layout on the TestItem back to the default.
            UPDATE "test_items"
            SET "media_layout" = 'FULL_WIDTH_STACKED'::"TestItemMediaLayout"
            WHERE "id" = v_test_item_id;
        END IF;
    END IF;

    -- The return value for an AFTER DELETE trigger is ignored.
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- 2. Drop the trigger if it already exists (to prevent errors on re-run)
DROP TRIGGER IF EXISTS trg_on_last_media_delete
ON "media";

-- 3. Create the trigger and attach it to the function
CREATE TRIGGER trg_on_last_media_delete
AFTER DELETE ON "media"
FOR EACH ROW
EXECUTE FUNCTION fn_reset_media_layout();