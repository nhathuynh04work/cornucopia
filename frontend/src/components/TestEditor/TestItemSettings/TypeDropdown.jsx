import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { itemTypeArray, ITEM_CONFIG } from "@/lib/item.config";
import { ItemTypeIcon } from "@/components/TestEditor/ItemList/ItemTypeIcon";

export default function TypeDropdown({ currentType, onChange }) {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);
	const config = ITEM_CONFIG[currentType];

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target)
			) {
				setIsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [dropdownRef]);

	return (
		<div className="relative mb-2" ref={dropdownRef}>
			{/* The dropdown button */}
			<button
				type="button"
				// onClick={() => setIsOpen(!isOpen)}
				className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none flex justify-between items-center">
				<div className="flex items-center gap-2">
					<ItemTypeIcon type={currentType} small />
					<span className="text-[12px]">{config.label}</span>
				</div>
				{/* <ChevronDown className="w-3.5 h-3.5 text-gray-500" /> */}
			</button>

			{/* The dropdown menu */}
			{isOpen && (
				<div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg py-1">
					{itemTypeArray.map((type) => (
						<button
							key={type}
							onClick={() => {
								onChange(type);
								setIsOpen(false);
							}}
							className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
							<ItemTypeIcon type={type} small />
							<span className="text-[12px]">
								{ITEM_CONFIG[type].label}
							</span>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
