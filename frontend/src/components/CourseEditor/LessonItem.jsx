import { useState } from "react";
import PropertyMediaUploader from "../Media/PropertyMediaUploader";
import {
	FileText,
	Trash2,
	Video,
	X,
	Plus,
	Check,
	Loader2,
	Type,
	Film,
	ChevronDown,
	ChevronUp,
} from "lucide-react";
import { useUpdateLessonMutation } from "@/hooks/useLessonMutation";
import EditableText from "./EditableText";
import LessonTextEditor from "./LessonTextEditor";
import { useCourseEditorStore } from "@/store/courseEditorStore";

const lessonIcon = {
	VIDEO: <Video className="w-4 h-4 text-purple-600" />,
	TEXT: <FileText className="w-4 h-4 text-blue-600" />,
};

export default function LessonItem({ lesson }) {
	const lessonIndex = useCourseEditorStore((s) =>
		s.getLessonIndex(lesson.id)
	);

	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const [title, setTitle] = useState(lesson.title);

	const [isEditingContent, setIsEditingContent] = useState(false);
	const { mutateAsync: updateLesson, isPending: isUpdating } =
		useUpdateLessonMutation(lesson.id);

	async function handleSaveTitle() {
		if (title !== lesson.title) {
			await updateLesson({ title: title });
		}
		setIsEditingTitle(false);
	}

	function handleCancelTitle() {
		setIsEditingTitle(false);
		setTitle(lesson.title);
	}

	function toggleContentEditor() {
		setIsEditingContent((e) => !e);
	}

	async function handleSelectType(type) {
		await updateLesson({ type });
	}

	return (
		<div className="rounded-md border border-gray-200 bg-gray-50">
			{/* --- Lesson Header --- */}
			<div className="flex items-center justify-between p-3">
				<div className="flex items-center gap-3 w-full">
					<span className="text-sm font-medium text-gray-500 flex-shrink-0">
						Lesson {lessonIndex + 1}:
					</span>

					{lesson.type && lessonIcon[lesson.type]}

					<EditableText
						isEditing={isEditingTitle}
						setIsEditing={setIsEditingTitle}
						value={title}
						onChange={setTitle}
						onSave={handleSaveTitle}
						isPending={isUpdating}
						spanClassName="text-gray-700"
						inputClassName="font-semibold text-gray-700 border-b border-purple-300 w-full p-0"
					/>
				</div>

				{/* --- Header Buttons (Unchanged) --- */}
				<div className="flex items-center gap-3 ml-4 flex-shrink-0">
					{isEditingTitle ? (
						<>
							<button
								onClick={handleSaveTitle}
								disabled={isUpdating}>
								{isUpdating ? (
									<Loader2 className="w-4 h-4 animate-spin" />
								) : (
									<Check className="w-4 h-4 text-green-600" />
								)}
							</button>
							<button
								onClick={handleCancelTitle}
								disabled={isUpdating}>
								<X className="w-4 h-4 text-gray-500" />
							</button>
						</>
					) : (
						<>
							<button
								onClick={toggleContentEditor}
								disabled={isUpdating}>
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
						</>
					)}
				</div>
			</div>

			{/* --- Collapsible Editor Content (Unchanged) --- */}
			{isEditingContent && (
				<div className="p-4 border-t border-gray-200">
					{lesson.type === "VIDEO" && (
						<PropertyMediaUploader
							label="Lesson Video"
							currentMediaUrl={lesson.videoUrl}
							entityId={lesson.id}
							entityType="lesson"
							property="videoUrl"
							mediaType="video"
							disabled={isUpdating}
						/>
					)}

					{lesson.type === "TEXT" && (
						<LessonTextEditor
							onSave={(content) =>
								updateLesson({ textContent: content })
							}
							isSaving={isUpdating}
							initialContent={lesson.textContent}
						/>
					)}

					{!lesson.type && (
						<div className="flex items-center justify-center gap-4">
							<button
								onClick={() => handleSelectType("VIDEO")}
								className="flex flex-col items-center gap-2 p-4 border rounded-md hover:bg-gray-100">
								<Film
									className="w-8 h-8 text-purple-600"
									strokeWidth={1.2}
								/>
								<span className="text-sm font-medium">
									Add Video
								</span>
							</button>
							<button
								onClick={() => handleSelectType("TEXT")}
								className="flex flex-col items-center gap-2 p-4 border rounded-md hover:bg-gray-100">
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
