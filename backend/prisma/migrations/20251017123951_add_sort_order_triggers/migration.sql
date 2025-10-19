-- SORT ORDER FOR NEW SECTION IN A TEST
CREATE OR REPLACE FUNCTION fn_set_section_sort_order()
RETURNS TRIGGER AS $$
BEGIN
    SELECT COALESCE(MAX(sort_order), 0) + 1
    INTO NEW.sort_order
    FROM test_sections
    WHERE test_id = NEW.test_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_section_sort_order ON test_sections;
CREATE TRIGGER trg_set_section_sort_order
    BEFORE INSERT ON test_sections
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_section_sort_order();

-------------------------------------------------------------------------------------------
-- SORT ORDER FOR A NEW ITEM (HANDLES BOTH TOP-LEVEL AND CHILD ITEMS)
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
        -- Item is top-level; sort within its section among other top-level items.
        SELECT COALESCE(MAX(sort_order), 0) + 1
        INTO NEW.sort_order
        FROM test_items
        WHERE section_id = NEW.section_id AND parent_item_id IS NULL;
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
-- SORT ORDER FOR A NEW ANSWER OPTION IN AN ITEM
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