import { Film, Type } from "lucide-react";

export default function LessonTypePicker({ onSelectType, isBusy }) {
	return (
		<div className="flex items-center justify-center gap-4">
			<button
				onClick={() => onSelectType("VIDEO")}
				className="flex flex-col items-center gap-2 p-4 border rounded-md hover:bg-gray-100 disabled:opacity-50"
				disabled={isBusy}>
				<Film className="w-8 h-8 text-purple-600" strokeWidth={1.2} />
				<span className="text-sm font-medium">Add Video</span>
			</button>
			<button
				onClick={() => onSelectType("TEXT")}
				className="flex flex-col items-center gap-2 p-4 border rounded-md hover:bg-gray-100 disabled:opacity-50"
				disabled={isBusy}>
				<Type className="w-8 h-8 text-blue-600" strokeWidth={1.2} />
				<span className="text-sm font-medium">Add Text</span>
			</button>
		</div>
	);
}
