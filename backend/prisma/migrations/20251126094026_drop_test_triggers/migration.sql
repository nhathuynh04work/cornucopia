-- Drop triggers for sort order
DROP TRIGGER IF EXISTS trg_set_item_sort_order ON test_items;
DROP TRIGGER IF EXISTS trg_set_option_sort_order ON answer_options;

-- Drop functions for sort order
DROP FUNCTION IF EXISTS fn_set_item_sort_order;
DROP FUNCTION IF EXISTS fn_set_option_sort_order;

-- Drop triggers for correct answer enforcement
DROP TRIGGER IF EXISTS trg_enforce_single_correct_answer ON answer_options;
DROP TRIGGER IF EXISTS trg_ensure_correct_answer_after_delete ON answer_options;

-- Drop functions for correct answer enforcement
DROP FUNCTION IF EXISTS fn_enforce_single_correct_answer;
DROP FUNCTION IF EXISTS fn_ensure_correct_answer_after_delete;

