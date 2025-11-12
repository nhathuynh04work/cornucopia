import { useState } from "react";
import { Loader2, UploadCloud } from "lucide-react";
import { useCourseEditorStore } from "@/store/courseEditorStore";
import { useUpdateLesson } from "@/hooks/useLessonMutation";
import { getReadingTime } from "@/lib/getReadingTime";
import LessonVideoUploader from "./LessonVideoUploader";
import LessonTextEditor from "./LessonTextEditor";
import LessonTypePicker from "./LessonTypePicker";
import ConfirmationModal from "../ConfirmationModal";

export default function LessonContent({ lesson }) {
	const [showConfirmModal, setShowConfirmModal] = useState(false);

	const course = useCourseEditorStore((s) => s.course);
	const hasEnrollments = (course?._count?.enrollments || 0) > 0;

	const { mutate: updateLesson, isPending: isUpdating } = useUpdateLesson(
		lesson.id
	);

	const isPublic = lesson.status === "PUBLIC";

	function handleTextSave(content) {
		updateLesson({
			textContent: content,
			duration: getReadingTime(content),
		});
	}

	function handleTypeSelect(type) {
		updateLesson({ type });
	}

	function handlePublishClick() {
		if (hasEnrollments) {
			setShowConfirmModal(true);
			return;
		}

		updateLesson({ status: "PUBLIC" });
	}

	function handleConfirmPublish() {
		updateLesson(
			{ status: "PUBLIC" },
			{ onSuccess: () => setShowConfirmModal(false) }
		);
	}

	return (
		<>
			<div className="p-4 border-t border-gray-200">
				{lesson.type === "VIDEO" && (
					<LessonVideoUploader lesson={lesson} />
				)}

				{lesson.type === "TEXT" && (
					<LessonTextEditor
						onSave={handleTextSave}
						isSaving={isUpdating}
						initialContent={lesson.textContent}
					/>
				)}

				{!lesson.type && (
					<LessonTypePicker
						onSelectType={handleTypeSelect}
						isBusy={isUpdating}
					/>
				)}

				{lesson.type && !isPublic && (
					<div className="mt-6 pt-4 border-t border-gray-200">
						<div className="flex items-center justify-between">
							<p className="text-sm text-gray-600">
								This lesson is currently a{" "}
								<span className="font-semibold text-gray-800">
									Draft
								</span>
								.
							</p>
							<button
								onClick={handlePublishClick}
								disabled={isUpdating}
								className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-gray-300">
								{isUpdating ? (
									<Loader2 className="w-4 h-4 animate-spin" />
								) : (
									<UploadCloud className="w-4 h-4" />
								)}
								Publish
							</button>
						</div>
					</div>
				)}
			</div>

			{showConfirmModal && (
				<ConfirmationModal
					title="Publish Lesson?"
					variant="primary"
					confirmText="Publish"
					onConfirm={handleConfirmPublish}
					onCancel={() => setShowConfirmModal(false)}
					isLoading={isUpdating}>
					<p>
						Are you sure you want to publish this lesson? If this
						course has enrolled students, you will not be able to
						move it back to a draft.
					</p>
				</ConfirmationModal>
			)}
		</>
	);
}
