import { useTestEditorStore } from "../../../store/testEditorStore";
import { useState } from "react";
import ItemActions from "./ItemActions";
import ItemIndex from "./ItemIndex";

const baseClasses =
	"rounded-md text-[12px] text-gray-700 cursor-pointer flex flex-col";

function Item({ item }) {
	const type = item?.type === "group" ? "group" : item?.questionType;
	const isGroup = type === "group";

	const isOpen = useTestEditorStore((s) => s.isGroupOpen(item?.id));
	const changeCurrentItem = useTestEditorStore((s) => s.changeCurrentItem);

	const [hoveredMenu, setHoveredMenu] = useState(null);

	return (
		<div className={`${baseClasses} ${isGroup ? "border" : ""} min-w-0`}>
			<div
				className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 transition"
				onClick={() => changeCurrentItem(item?.id)}>
				{/* Left: Icon + Label */}
				<ItemIndex item={item} />

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
					item.children.map((item) => (
						<Item key={item.id} item={item} />
					))}
			</div>
		</div>
	);
}

export default Item;
