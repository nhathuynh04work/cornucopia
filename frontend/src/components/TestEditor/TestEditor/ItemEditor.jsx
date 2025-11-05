import AnswerOption from "./AnswerOption";
import DebouncedTextarea from "./DebouncedTextarea";
import { MoveRight } from "lucide-react";
import ItemIndex from "../ItemList/ItemIndex";
import { itemTypeEnum, mediaLayouts } from "@/lib/item.config";
import MediaList from "@/components/Media/MediaList";
import EditorLayout from "./EditorLayout"; 
import { useAddOption, useUpdateItem } from "@/hooks/useTestEditorMutation";

function ItemEditor({ item }) {
	const { mutate: addOption } = useAddOption(item.id);
	const { mutate: updateItem } = useUpdateItem(item.id);

	// --- 2. Define the 3 content blocks ---

	const textBlock = (
		<div className="flex gap-2 items-start">
			<span className="flex items-center gap-1">
				<ItemIndex item={item} />
				<MoveRight className="w-3 h-3" />
			</span>
			<DebouncedTextarea
				initialValue={item.text}
				mutationFn={updateItem}
				mutationKey="text"
				className="flex-1 bg-transparent focus:outline-none focus:ring-0 resize-none field-sizing-content text-gray-800 font-medium"
				placeholder="Enter question text..."
				rows={3}
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

	const contentBlock =
		item.type === itemTypeEnum.MULTIPLE_CHOICE ? (
			<div className="w-full flex flex-col gap-4 items-start">
				{item.answerOptions.map((o, i) => (
					<AnswerOption
						option={o}
						key={o.id}
						order={i}
						optionCount={item.answerOptions.length}
					/>
				))}
				<button
					onClick={addOption}
					type="button"
					className="flex items-center justify-center w-full rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:text-gray-700 hover:border-gray-400 py-4 transition-colors">
					+ Add option
				</button>
			</div>
		) : null; // You can add UI for other types here

	// --- 3. Render the layout ---
	return (
		<EditorLayout
			mediaLayout={item.mediaLayout}
			textBlock={textBlock}
			mediaBlock={mediaBlock}
			contentBlock={contentBlock}
		/>
	);
}

export default ItemEditor;
