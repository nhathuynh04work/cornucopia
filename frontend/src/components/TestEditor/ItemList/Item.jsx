import { itemTypeEnum } from "@/lib/item.config";
import ItemActions from "./ItemActions";
import ItemIndex from "./ItemIndex";
import { useTestEditorStore } from "@/store/testEditorStore";

function Item({ item }) {
	const isGroup = item.type === itemTypeEnum.GROUP;

	const isOpen = useTestEditorStore((s) => s.isGroupOpen(item?.id));
	const changeCurrentItem = useTestEditorStore((s) => s.changeCurrentItem);

	return (
		<div
			className={`rounded-md text-[12px] text-gray-700 cursor-pointer flex flex-col min-w-0 
                ${isGroup ? "border" : ""} `}>
			<div
				className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 transition"
				onClick={() => changeCurrentItem(item?.id)}>
				{/* Left: Icon + Label */}
				<ItemIndex item={item} />

				{/* Right: Actions */}
				<ItemActions item={item} />
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
