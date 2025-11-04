import { Square, CheckSquare } from "lucide-react";
import { Video, FileText } from "lucide-react";

// (COLORLESS) LESSON ICONS
const lessonIcon = {
	VIDEO: <Video className="w-3 h-3 text-gray-600" />,
	TEXT: <FileText className="w-3 h-3 text-gray-600" />,
};

function LessonItem({
	lesson,
	lessonNumber,
	isCompleted,
	isActive,
	onSelectLesson,
}) {
	// Checkbox click handler
	const handleToggleComplete = (e) => {
		e.stopPropagation();
		// Add check/uncheck logic here
		console.log("Toggled check!");
	};

	return (
		<div
			className={`grid grid-cols-[auto_1fr] border-t border-gray-200 transition-colors duration-150 items-start font-extralight ${
				isActive
					? "bg-gray-300 text-gray-900" // Active state
					: "text-gray-700 hover:bg-gray-300 hover:text-gray-900" // Default + Hover state
			}`}>
			{/* --- Column 1: Checkbox --- */}
			<button onClick={handleToggleComplete} className="px-4 py-[14px]">
				{isCompleted ? (
					<CheckSquare className="w-4 h-4 text-purple-600" />
				) : (
					<Square className="w-4 h-4 text-gray-500" />
				)}
			</button>

			{/* --- Column 2: Lesson Info --- */}
			<button
				onClick={() => onSelectLesson(lesson)}
				className="w-full text-left py-3 pr-4">
				{/* Row 1: Title */}
				<span className="truncate text-sm block">
					{lessonNumber}. {lesson.title}
				</span>

				{/* Row 2: Icon and Time */}
				<div className="flex items-center gap-2 mt-3">
					{lessonIcon[lesson.type]}
					<span className="text-xs text-gray-600">
						{lesson.duration || "5m"}
					</span>
				</div>
			</button>
		</div>
	);
}

export default LessonItem;
