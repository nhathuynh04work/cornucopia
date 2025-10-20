import React, { useState } from "react";
import { ItemTypeIcon } from "./ItemTypeIcon";
import { itemTypeArray, ITEM_CONFIG, itemTypeEnum } from "@/lib/item.config";

function AddItemModal({ children, isGroup = false, onAddItem }) {
	const [isOpen, setIsOpen] = useState(false);

	function handleOpen(e) {
		e.stopPropagation();
		setIsOpen(true);
	}

	function handleClose(e) {
		e.stopPropagation();
		setIsOpen(false);
	}

	function handleModalClick(e) {
		e.stopPropagation();
	}

	const visibleTypes = isGroup
		? itemTypeArray.filter((type) => type !== itemTypeEnum.GROUP)
		: itemTypeArray;

	return (
		<>
			{React.cloneElement(children, { onClick: handleOpen })}

			{isOpen && (
				// Overlay
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
					onClick={handleClose}>
					{/* Modal content */}
					<div
						className="w-full max-w-xs bg-white rounded-lg shadow-lg p-4 text-base"
						onClick={handleModalClick}>
						<h3 className="text-md font-medium text-gray-900 mb-4">
							Add new item
						</h3>

						<div className="flex flex-col gap-2">
							{visibleTypes.map((type) => (
								<button
									key={type}
									onClick={() => onAddItem(type)}
									className="flex items-center gap-3 rounded-lg text-left transition p-3 text-sm text-gray-700 hover:bg-gray-100 border">
									<ItemTypeIcon type={type} />
									<span>{ITEM_CONFIG[type].label}</span>
								</button>
							))}
						</div>

						<button
							onClick={handleClose}
							className="mt-4 w-full text-center py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
							Done
						</button>
					</div>
				</div>
			)}
		</>
	);
}

export default AddItemModal;
