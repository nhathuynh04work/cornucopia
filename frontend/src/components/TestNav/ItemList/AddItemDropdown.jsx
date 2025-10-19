import { ItemTypeIcon } from "./ItemTypeIcon";
import { ITEM_CONFIG, addItemMenu } from "../../../lib/config";
import { testItemTypes } from "../../../lib/constants";

function AddItemDropdown({
	parentItemId = null, // This field is for adding item to a group
	show,
	isGroup = false,
	onAddItem,
}) {
	const visibleKeys = isGroup
		? addItemMenu.filter((key) => key !== testItemTypes.GROUP)
		: addItemMenu;

	if (!show) return null;

	return (
		<div className="absolute right-0 w-40 bg-white shadow-lg border border-gray-100 rounded-lg p-1 flex flex-col z-20">
			{visibleKeys.map((key) => {
				const config = ITEM_CONFIG[key];
				return (
					<button
						key={key}
						onClick={() =>
							onAddItem({
								type: config.action.type,
								questionType:
									config.action.questionType ?? null,
								parentItemId,
							})
						}
						className="flex items-center gap-2 rounded-md text-left transition px-2 py-1.5 text-xs text-gray-700 hover:bg-purple-50">
						<ItemTypeIcon type={key} />
						<span>{config.label}</span>
					</button>
				);
			})}
		</div>
	);
}

export default AddItemDropdown;
