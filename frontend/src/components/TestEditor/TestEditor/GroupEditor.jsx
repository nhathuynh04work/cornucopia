import DebouncedTextarea from "./DebouncedTextarea";
import { MoveRight } from "lucide-react";
import ChildSummary from "./ChildSummary";
import ItemIndex from "../ItemList/ItemIndex";
import MediaList from "@/components/Media/MediaList";
import EditorLayout from "./EditorLayout";
import { mediaLayouts } from "@/lib/item.config";
import { useUpdateItem } from "@/hooks/useTestMutation";

function GroupEditor({ item }) {
	const { mutate: updateItem } = useUpdateItem(item.id);

	const textBlock = (
		<div className="flex items-start gap-3">
			<span className="flex items-center gap-1">
				<ItemIndex item={item} />
				<MoveRight className="w-3 h-3 text-gray-500" />
			</span>
			<DebouncedTextarea
				initialValue={item.text}
				mutationFn={updateItem}
				mutationKey="text"
				className="flex-1 bg-transparent focus:outline-none focus:ring-0 resize-none field-sizing-content text-gray-800 font-medium"
				placeholder="Enter group instructions..."
			/>
		</div>
	);

	const mediaListLayout =
		item.mediaLayout === mediaLayouts.FULL_WIDTH_STACKED ? "grid" : "list";

	const mediaBlock = (
		<MediaList
			media={item.media}
			layout={mediaListLayout}
			isEditing={true}
		/>
	);

	const contentBlock = (
		<div className="flex flex-col gap-2">
			{item.children.map((child) => (
				<ChildSummary key={child.id} child={child} />
			))}
		</div>
	);

	return (
		<EditorLayout
			mediaLayout={item.mediaLayout}
			textBlock={textBlock}
			mediaBlock={mediaBlock}
			contentBlock={contentBlock}
		/>
	);
}

export default GroupEditor;
