import { Square, CheckSquare } from "lucide-react";
import { Video, FileText } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import lessonApi from "@/apis/lessonApi";

const lessonIcon = {
	VIDEO: <Video className="w-3 h-3 text-gray-600" />,
	TEXT: <FileText className="w-3 h-3 text-gray-600" />,
};

function LessonItem({
	courseId,
	lesson,
	lessonNumber,
	isCompleted,
	isActive,
	onSelectLesson,
}) {
	const queryClient = useQueryClient();

	const { mutate: toggleComplete } = useMutation({
		mutationFn: () =>
			lessonApi.toggleComplete({
				lessonId: lesson.id,
				isCompleted: !isCompleted,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["course", courseId, "learn"],
			});
		},
		onError: (err) => {
			console.error("Failed to update progress", err);
		},
	});

	const handleToggleComplete = (e) => {
		e.stopPropagation();
		toggleComplete();
	};

	const durationInMinutes = lesson.duration
		? Math.round(lesson.duration / 60)
		: 0;

	return (
		<div
			className={`grid grid-cols-[auto_1fr] border-t border-gray-200 transition-colors duration-150 items-start font-extralight ${
				isActive
					? "bg-gray-300 text-gray-900"
					: "text-gray-700 hover:bg-gray-300 hover:text-gray-900"
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
						{/* 4. Display formatted time */}
						{durationInMinutes}m
					</span>
				</div>
			</button>
		</div>
	);
}

export default LessonItem;
