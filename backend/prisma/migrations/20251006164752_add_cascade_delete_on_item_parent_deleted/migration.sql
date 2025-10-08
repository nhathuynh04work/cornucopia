-- DropForeignKey
ALTER TABLE "public"."test_items" DROP CONSTRAINT "test_items_parent_item_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."test_items" ADD CONSTRAINT "test_items_parent_item_id_fkey" FOREIGN KEY ("parent_item_id") REFERENCES "public"."test_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
