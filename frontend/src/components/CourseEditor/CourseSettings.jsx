import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Loader2, Trash, CheckCircle, EyeOff, UploadCloud } from "lucide-react";
import { useCourseEditorStore } from "@/store/courseEditorStore";
import { useDeleteCourse, useUpdateCourse } from "@/hooks/useCourseMutation";
import ConfirmationModal from "../Shared/ConfirmationModal";

const statusDescriptions = {
	DRAFT: "Course is not visible and cannot be enrolled in by students.",
	PUBLIC: "Course is visible in the marketplace and open for enrollment.",
	UNLISTED:
		"Course is not in the marketplace, but enrolled students have access.",
};

export default function CourseSettings() {
	const course = useCourseEditorStore((s) => s.course);
	const navigate = useNavigate();
	const [showConfirmModal, setShowConfirmModal] = useState(false);

	const { mutate: updateCourse, isPending: isUpdating } = useUpdateCourse(
		course.id
	);
	const { mutate: deleteCourse, isPending: isDeleting } = useDeleteCourse(
		course.id
	);

	const hasEnrollments = (course._count?.enrollments || 0) > 0;

	function handleUpdateStatus(newStatus) {
		updateCourse(
			{ status: newStatus },
			{ onSuccess: () => toast.success("Status updated") }
		);
	}

	function handleDelete() {
		deleteCourse(
			{},
			{
				onSuccess: () => {
					toast.success("Course deleted");
					navigate("/courses/admin");
				},
			}
		);
	}

	return (
		<div className="space-y-8 max-w-2xl">
			<p className="mt-1 text-sm text-gray-600">
				Manage your course's publishing status and general settings.
			</p>

			{/* --- NEW: Status Settings (Button-based) --- */}
			<div className="p-4 border rounded-lg bg-white shadow-sm">
				<label className="block text-md font-semibold text-gray-900">
					Publishing Status
				</label>
				<p className="mt-1 text-sm text-gray-600">
					{statusDescriptions[course.status]}
				</p>

				<div className="mt-4 flex flex-col sm:flex-row gap-3">
					{/* --- DRAFT --- */}
					{course.status === "DRAFT" && (
						<button
							type="button"
							onClick={() => handleUpdateStatus("PUBLIC")}
							disabled={isUpdating}
							className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-gray-300">
							<UploadCloud className="w-4 h-4" />
							Publish Course
						</button>
					)}

					{/* --- PUBLIC --- */}
					{course.status === "PUBLIC" && (
						<button
							type="button"
							onClick={() => handleUpdateStatus("UNLISTED")}
							disabled={isUpdating}
							className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:bg-gray-300">
							<EyeOff className="w-4 h-4" />
							Unlist Course
						</button>
					)}

					{/* --- UNLISTED --- */}
					{course.status === "UNLISTED" && (
						<button
							type="button"
							onClick={() => handleUpdateStatus("PUBLIC")}
							disabled={isUpdating}
							className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-gray-300">
							<CheckCircle className="w-4 h-4" />
							Re-publish
						</button>
					)}

					{isUpdating && (
						<Loader2 className="w-5 h-5 animate-spin text-gray-400" />
					)}
				</div>
			</div>

			{/* --- Danger Zone --- */}
			<div className="p-4 border !border-red-300 rounded-lg bg-red-50 shadow-sm">
				<h3 className="text-md font-semibold text-red-900">
					Danger Zone
				</h3>
				<p className="mt-1 text-sm text-red-700">
					{hasEnrollments
						? "You cannot delete this course because it has students enrolled. Unlist it to prevent new enrollments."
						: "Be careful, this action is permanent and cannot be undone."}
				</p>
				<button
					type="button"
					onClick={() => setShowConfirmModal(true)}
					disabled={isDeleting || hasEnrollments}
					className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
					title={
						hasEnrollments
							? "Cannot delete a course with enrolled students."
							: "Delete this course"
					}>
					<Trash className="w-4 h-4" />
					Delete this course
				</button>
			</div>

			{/* --- Confirmation Modal --- */}
			{showConfirmModal && (
				<ConfirmationModal
					title="Delete course?"
					variant="danger"
					confirmText="Delete"
					isLoading={isDeleting}
					onConfirm={handleDelete}
					onCancel={() => setShowConfirmModal(false)}>
					<p>
						Are you sure you want to delete "{course.name}"? All of
						its data, including modules and lessons, will be
						permanently removed.
					</p>
				</ConfirmationModal>
			)}
		</div>
	);
}
