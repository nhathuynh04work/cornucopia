import { useState } from "react";
import {
	FileText,
	Video,
	X,
	Plus,
	Type,
	Film,
	ChevronDown,
	ChevronUp,
} from "lucide-react";
import { useUpdateLessonMutation } from "@/hooks/useLessonMutation";
import EditableText from "../CourseEditor/EditableText";
import LessonTextEditor from "../CourseEditor/LessonTextEditor";
import { useCourseEditorStore } from "@/store/courseEditorStore";
import { getReadingTime } from "@/lib/getReadingTime";
import LessonVideoUploader from "./LessonVideoUploader";

const lessonIcon = {
	VIDEO: <Video className="w-4 h-4 text-purple-600" />,
	TEXT: <FileText className="w-4 h-4 text-blue-600" />,
};

export default function LessonItem({ lesson }) {
	const lessonIdx = useCourseEditorStore((s) => s.getLessonIndex(lesson.id));
	const [isEditingContent, setIsEditingContent] = useState(false);

	const { mutateAsync: updateLesson, isPending: isUpdating } =
		useUpdateLessonMutation(lesson.id);

	const isBusy = isUpdating;

	return (
		<div className="relative group rounded-md border border-gray-200 bg-gray-50">
			{/* --- Lesson Header --- */}
			<div className="flex items-center justify-between p-3">
				<div className="flex items-center gap-3 w-full">
					<span className="text-sm font-medium text-gray-500 flex-shrink-0">
						Lesson {lessonIdx + 1}:
					</span>

					{lesson.type && lessonIcon[lesson.type]}

					<EditableText
						initialValue={lesson.title}
						onSave={(value) => updateLesson({ title: value })}
						isPending={isBusy}
						spanClassName="text-gray-700 text-sm"
						inputClassName="text-gray-700 text-sm p-0"
					/>
				</div>

				<button
					onClick={() => setIsEditingContent((e) => !e)}
					disabled={isBusy}>
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

			{/* Collapsible Editor Content */}
			{isEditingContent && (
				<div className="p-4 border-t border-gray-200">
					{lesson.type === "VIDEO" && (
						<LessonVideoUploader lesson={lesson} />
					)}

					{lesson.type === "TEXT" && (
						<LessonTextEditor
							onSave={(content) =>
								updateLesson({
									textContent: content,
									duration: getReadingTime(content),
								})
							}
							isSaving={isBusy}
							initialContent={lesson.textContent}
						/>
					)}

					{/* Type picker */}
					{!lesson.type && (
						<div className="flex items-center justify-center gap-4">
							<button
								onClick={() => updateLesson({ type: "VIDEO" })}
								className="flex flex-col items-center gap-2 p-4 border rounded-md hover:bg-gray-100"
								disabled={isBusy}>
								<Film
									className="w-8 h-8 text-purple-600"
									strokeWidth={1.2}
								/>
								<span className="text-sm font-medium">
									Add Video
								</span>
							</button>
							<button
								onClick={() => updateLesson({ type: "TEXT" })}
								className="flex flex-col items-center gap-2 p-4 border rounded-md hover:bg-gray-100"
								disabled={isBusy}>
								<Type
									className="w-8 h-8 text-blue-600"
									strokeWidth={1.2}
								/>
								<span className="text-sm font-medium">
									Add Text
								</span>
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
