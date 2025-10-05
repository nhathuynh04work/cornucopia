import { useAddItemMutation } from "../../hooks/useSectionMutation";
import { useTestEditorStore } from "../../store/testEditorStore";
import { Plus } from "lucide-react";

function ItemList() {
	const currentSection = useTestEditorStore((s) => s.currentSection);
	const { mutate: addItem } = useAddItemMutation(currentSection?.id);

	return (
		<section className="flex-1 flex flex-col">
			{/* Sticky header */}
			<div className="sticky top-0 z-10 bg-white p-4 border-b flex justify-between items-center">
				<h3 className="font-medium text-sm text-gray-700 uppercase tracking-wide">
					Items
				</h3>

				<button
					onClick={() =>
						addItem({
							type: "question",
							questionType: "multiple_choice",
						})
					}
					className="text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1">
					<Plus className="w-4 h-4" />
				</button>
			</div>

			{/* Scrollable item list */}
			<div className="flex-1 overflow-y-auto p-4 space-y-1">
				{currentSection?.items?.length ? (
					currentSection.items.map((itemId) => (
						<div
							key={itemId}
							className="px-3 py-2 rounded-md hover:bg-gray-100 text-sm text-gray-700 cursor-pointer">
							Item {itemId}
						</div>
					))
				) : (
					<p className="text-xs text-gray-400 italic">
						No items yet. Add one above.
					</p>
				)}
			</div>
		</section>
	);
}

export default ItemList;
