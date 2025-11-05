import { useState } from "react";

export default function LessonTextEditor({ onSave, isSaving, initialContent }) {
	const [content, setContent] = useState(initialContent || "");

	function handleSaveClick() {
		onSave(content);
	}
    
	return (
		<div className="space-y-2">
			<textarea
				className="w-full h-40 p-2 border rounded-md"
				placeholder="Start writing your lesson..."
				value={content}
				onChange={(e) => setContent(e.target.value)}
			/>
			<button
				onClick={handleSaveClick}
				disabled={isSaving}
				className="px-3 py-1 bg-purple-700 text-white text-sm rounded-md disabled:bg-purple-400">
				{isSaving ? "Saving..." : "Save Text"}
			</button>
		</div>
	);
}
