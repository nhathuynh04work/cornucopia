import { useTestEditorStore } from "@/store/testEditorStore";
import ItemSettingsForm from "./ItemSettingsForm";
import { EditPreviewSwitch } from "./EditPreviewSwitch";
import Avatar from "@/components/Avatar";

function TestItemSettings() {
	const currentItem = useTestEditorStore((s) => s.getCurrentItem());

	return (
		<div className="flex flex-col h-full">
			{/* 1. Header */}
			<div className="flex justify-between items-center border-b px-4 py-3">
				<EditPreviewSwitch />
				<Avatar />
			</div>

			{/* 2. Content */}
			<div className="flex-1 overflow-y-auto scroll-container">
				{currentItem ? (
					<ItemSettingsForm currentItem={currentItem} />
				) : (
					<div className="h-full flex items-center justify-center text-center">
						<p className="text-gray-500 text-sm px-6">
							Select an item to edit its settings.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default TestItemSettings;
