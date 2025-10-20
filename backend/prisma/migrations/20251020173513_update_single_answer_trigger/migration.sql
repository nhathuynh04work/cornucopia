-- AlterTable
ALTER TABLE "test_items" ADD COLUMN     "allow_multiple_correct" BOOLEAN DEFAULT false;

-- =====================================================================
-- TRIGGER 1: Enforce a Single Correct Answer
-- Runs on INSERT or UPDATE
-- =====================================================================
CREATE OR REPLACE FUNCTION fn_enforce_single_correct_answer()
RETURNS TRIGGER AS $$
DECLARE
    v_allow_multiple BOOLEAN;
BEGIN
    -- Only run this logic if the new/updated row is being set to TRUE
    IF NEW.is_correct = TRUE THEN

        -- Get the 'allow_multiple_correct' setting from the parent question
        SELECT allow_multiple_correct
        INTO v_allow_multiple
        FROM test_items
        WHERE id = NEW.item_id;

        -- If the flag is FALSE (or NULL), then enforce the single-correct rule
        IF v_allow_multiple = FALSE THEN
            -- Set all other options for this question to be incorrect.
            UPDATE answer_options
            SET is_correct = FALSE
            WHERE
                item_id = NEW.item_id
                AND id != NEW.id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the old trigger
DROP TRIGGER IF EXISTS trg_enforce_single_correct_answer ON answer_options;

-- Re-create the trigger (it now uses the new function definition)
CREATE TRIGGER trg_enforce_single_correct_answer
    AFTER INSERT OR UPDATE ON answer_options
    FOR EACH ROW
    EXECUTE FUNCTION fn_enforce_single_correct_answer();


-- =====================================================================
-- TRIGGER 2: Promote a New Correct Answer
-- Runs on DELETE
-- =====================================================================
CREATE OR REPLACE FUNCTION fn_ensure_correct_answer_after_delete()
RETURNS TRIGGER AS $$
DECLARE
    remaining_correct_count INT;
    first_remaining_option_id INT;
BEGIN
    -- This logic only needs to run if the deleted option was the correct one.
    IF OLD.is_correct = TRUE THEN
        -- Count how many correct answers are *left* for this question.
        SELECT COUNT(*)
        INTO remaining_correct_count
        FROM answer_options
        WHERE item_id = OLD.item_id AND is_correct = TRUE;

        -- If the count is 0, it means we just deleted the *only* correct answer.
        -- We must now promote another answer to be the correct one.
        IF remaining_correct_count = 0 THEN
            -- Find the 'first' remaining option for this question.
            SELECT id
            INTO first_remaining_option_id
            FROM answer_options
            WHERE item_id = OLD.item_id
            ORDER BY sort_order ASC, id ASC
            LIMIT 1;

            -- If we found a remaining option, update it to be the new correct answer.
            IF first_remaining_option_id IS NOT NULL THEN
                UPDATE answer_options
                SET is_correct = TRUE
                WHERE id = first_remaining_option_id;
            END IF;
        END IF;
    END IF;

    -- Return the old row to complete the DELETE operation.
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it already exists
DROP TRIGGER IF EXISTS trg_ensure_correct_answer_after_delete ON answer_options;

-- Create the trigger
CREATE TRIGGER trg_ensure_correct_answer_after_delete
    AFTER DELETE ON answer_options
    FOR EACH ROW
    EXECUTE FUNCTION fn_ensure_correct_answer_after_delete();