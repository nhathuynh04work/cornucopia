import React from "react";
import { LayoutPanelLeft, LayoutPanelTop, LayoutList } from "lucide-react";
import { mediaLayouts } from "@/lib/item.config";
import { useUpdateItem } from "@/hooks/useTestMutation";

export default function ItemMediaLayoutSwitch({ currentItem }) {
	const { mutate: updateItem } = useUpdateItem(currentItem.id);

	if (!currentItem.media || currentItem.media.length === 0) {
		return null;
	}

	const layoutOptions = [
		{
			name: mediaLayouts.FULL_WIDTH_STACKED,
			icon: LayoutList,
			description: "Text, media, and questions are stacked vertically.",
		},
		{
			name: mediaLayouts.LEFT_STACKED,
			icon: LayoutPanelLeft,
			description:
				"Text and media are stacked in a left panel; questions are on the right.",
		},
		{
			name: mediaLayouts.TEXT_TOP_MEDIA_LEFT,
			icon: LayoutPanelTop,
			description:
				"Text is full-width at the top; media and questions are in panels below.",
		},
	];

	return (
		<div className="mb-4">
			<div className="grid grid-cols-3 gap-2">
				{layoutOptions.map((opt) => {
					const isActive = currentItem.mediaLayout === opt.name;
					const Icon = opt.icon;

					return (
						<button
							key={opt.name}
							title={opt.description}
							onClick={() =>
								updateItem({
									mediaLayout: opt.name,
								})
							}
							className={`flex flex-col items-center justify-center p-2 rounded-md border text-center transition-colors ${
								isActive
									? "bg-blue-50 text-blue-600 border-blue-400"
									: "bg-white text-gray-500 border-gray-300 hover:bg-gray-50"
							}`}>
							<Icon className="w-3.5 h-3.5" />
						</button>
					);
				})}
			</div>
		</div>
	);
}
