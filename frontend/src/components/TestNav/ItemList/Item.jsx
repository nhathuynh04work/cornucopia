import { EllipsisVertical, Plus } from "lucide-react";
import { useTestEditorStore } from "../../../store/testEditorStore";
import AddItemDropdown from "../ItemList/AddItemDropdown";
import ActionDropdown from "../ItemList/ActionDropdown";
import { useState } from "react";
import { ItemTypeIcon } from "./ItemTypeIcon";

const baseClasses =
	"rounded-md text-[12px] text-gray-700 cursor-pointer flex flex-col";

function Item({ id, onAddItem }) {
	const item = useTestEditorStore((s) => s.getEntity("items", id));
	const type = item.type === "group" ? "group" : item.questionType;
	const [hoveredMenu, setHoveredMenu] = useState(null);
	const [isOpen, setIsOpen] = useState(false);

	function toggleOpen() {
		setIsOpen((open) => !open);
	}

	return (
		<div
			className={`${baseClasses} ${type === "group" ? "border" : ""} ${
				item.parentItemId ? "" : "rounded-md"
			}`}>
			{/* Clickable header area */}
			<div
				className={`flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 transition`}
				onClick={type === "group" ? toggleOpen : null}>
				{/* Type + Number */}
				<div className="flex gap-2 items-center">
					<ItemTypeIcon type={type} groupOpen={isOpen} />
					<span>{item.id}</span>
				</div>

				{/* Buttons */}
				<div className="flex gap-1 relative">
					{type === "group" && (
						<div
							className="relative"
							onMouseEnter={() => setHoveredMenu("add")}
							onMouseLeave={() => setHoveredMenu(null)}>
							<Plus className="w-5 h-5 p-1 rounded-sm hover:bg-gray-200 cursor-pointer text-purple-600" />

							<AddItemDropdown
								isGroup
								size="small"
								show={hoveredMenu === "add"}
								onAddItem={(type) => {
									onAddItem?.(type, item.id);
									setHoveredMenu(null);
								}}
							/>
						</div>
					)}

					<div
						className="relative"
						onMouseEnter={() => setHoveredMenu("action")}
						onMouseLeave={() => setHoveredMenu(null)}>
						<EllipsisVertical className="w-5 h-5 p-1 rounded-sm hover:bg-gray-200 cursor-pointer" />
						<ActionDropdown
							show={hoveredMenu === "action"}
							size="small"
						/>
					</div>
				</div>
			</div>

			{/* Children */}
			{type === "group" &&
				isOpen &&
				item?.children.length > 0 &&
				item.children.map((childId) => (
					<Item key={childId} id={childId} onAddItem={onAddItem} />
				))}
		</div>
	);
}

export default Item;
