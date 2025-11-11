import {
	FileText,
	Video,
	Plus,
	X,
	ChevronDown,
	ChevronUp,
	CheckCircle,
	EyeOff,
} from "lucide-react";
import { useCourseEditorStore } from "@/store/courseEditorStore";
import { useUpdateLesson } from "@/hooks/useLessonMutation";
import EditableText from "./EditableText";

const lessonIcon = {
	VIDEO: <Video className="w-4 h-4 text-purple-600" />,
	TEXT: <FileText className="w-4 h-4 text-blue-600" />,
};

export default function LessonHeader({ lesson, isEditingContent, onToggle }) {
	const lessonIdx = useCourseEditorStore((s) => s.getLessonIndex(lesson.id));

	const { mutate: updateLesson, isPending: isUpdating } = useUpdateLesson(
		lesson.id
	);

	function handleTitleSave(value) {
		updateLesson({ title: value });
	}

	return (
		<>
			<div className="flex items-center justify-between p-3">
				{/* --- Left Side: Title & Info --- */}
				<div className="flex items-center gap-3 w-full">
					<div className="flex items-center gap-1 flex-shrink-0">
						{lesson.status === "PUBLIC" ? (
							<CheckCircle
								className="w-2.5 h-2.5 text-green-500"
								title="Public"
							/>
						) : (
							<EyeOff
								className="w-2.5 h-2.5 text-gray-400"
								title="Draft"
							/>
						)}
						<span className="text-sm font-medium text-gray-500">
							Lesson {lessonIdx + 1}:
						</span>
					</div>

					{lesson.type && lessonIcon[lesson.type]}

					<EditableText
						initialValue={lesson.title}
						onSave={handleTitleSave}
						isPending={isUpdating}
						spanClassName="text-gray-700 text-sm"
						inputClassName="text-gray-700 text-sm p-0"
					/>
				</div>

				{/* --- Right Side: Status & Toggle --- */}
				<div className="flex items-center gap-4">
					<button
						onClick={onToggle}
						disabled={isUpdating}
						className="flex-shrink-0">
						{isEditingContent ? (
							lesson.type ? (
								<ChevronUp className="w-4 h-4 text-gray-500" />
							) : (
								<X className="w-4 h-4 text-gray-500" />
							)
						) : lesson.type ? (
							<ChevronDown className="w-4 h-4 text-gray-500" />
						) : (
							<Plus className="w-4 h-4 text-purple-600" />
						)}
					</button>
				</div>
			</div>
		</>
	);
}
