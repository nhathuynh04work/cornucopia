import { useTestEditorStore } from "../../../store/testEditorStore";
import { useState } from "react";
import { ItemTypeIcon } from "./ItemTypeIcon";
import ItemActions from "./ItemActions";

const baseClasses =
	"rounded-md text-[12px] text-gray-700 cursor-pointer flex flex-col";

function Item({ id }) {
	const item = useTestEditorStore((s) => s.getEntity("items", id));
	const type = item.type === "group" ? "group" : item.questionType;
	const isGroup = type === "group";

	const isOpen = useTestEditorStore((s) => s.isGroupOpen(id));
	const toggleGroupOpen = useTestEditorStore((s) => s.toggleGroupOpen);

	const [hoveredMenu, setHoveredMenu] = useState(null);

	return (
		<div className={`${baseClasses} ${isGroup ? "border" : ""} min-w-0`}>
			<div
				className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 transition"
				onClick={isGroup ? () => toggleGroupOpen(id) : undefined}>
				{/* Left: Icon + Label */}
				<div className="flex gap-2 items-center">
					<ItemTypeIcon type={type} groupOpen={isOpen} />
					<span>{item.id}</span>
				</div>

				{/* Right: Actions */}
				<ItemActions
					item={item}
					hoveredMenu={hoveredMenu}
					setHoveredMenu={setHoveredMenu}
				/>
			</div>

			{/* Children */}
			<div className="max-h-[120px] overflow-y-auto hide-scrollbar">
				{isGroup &&
					isOpen &&
					item?.children?.length > 0 &&
					item.children.map((childId) => (
						<Item key={childId} id={childId} />
					))}
			</div>
		</div>
	);
}

export default Item;
