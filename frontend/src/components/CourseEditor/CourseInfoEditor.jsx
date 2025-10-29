import { UploadCloud, Loader2 } from "lucide-react";
import { useSetMediaPropertyMutation } from "@/hooks/useMediaMutation";
import { useUpdateCourseMutation } from "@/hooks/useCourseMutation";
import MediaUpload from "@/components/Media/MediaUpload";
import DebouncedInput from "@/components/DebouncedInput";
import DebouncedTextarea from "../TestEditor/TestEditor/DebouncedTextarea";
import { useCourseEditorStore } from "@/store/courseEditorStore";

function CourseInfoEditor() {
	const course = useCourseEditorStore((s) => s.course);
	const changeCoverUrl = useCourseEditorStore((s) => s.changeCoverUrl);

	const { mutate: updateCourse, isPending: isSaving } =
		useUpdateCourseMutation(course?.id);

	const setMediaProperty = useSetMediaPropertyMutation({
		onSuccess: (url) => changeCoverUrl(url),
	});

	// set the coverUrl field of the course
	function handleUploadSuccess({ s3Key }) {
		setMediaProperty.mutate({
			entityType: "course",
			entityId: course.id,
			property: "coverUrl",
			s3Key: s3Key,
		});
	}

	const isSubmitting = isSaving || setMediaProperty.isPending;

	return (
		<div className="max-w-2xl space-y-6">
			{/* --- Cover Image Section--- */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Cover Image
				</label>
				<div className="flex items-center gap-4">
					<img
						src={
							course?.coverUrl ||
							"https://via.placeholder.com/400x200"
						}
						alt="Course cover"
						className="w-60 aspect-video rounded-md object-cover bg-gray-100 border"
					/>
					<MediaUpload
						onUploadSuccess={handleUploadSuccess}
						disabled={isSubmitting}>
						<button
							type="button"
							className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
							<UploadCloud className="w-4 h-4" />
							Change Image
						</button>
					</MediaUpload>
				</div>
			</div>

			{/* --- Text Fields Form --- */}
			<div className="space-y-6">
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Course Name
					</label>
					<DebouncedInput
						initialValue={course?.name}
						mutationFn={updateCourse}
						mutationKey="name"
						className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
						placeholder="Enter course name..."
						disabled={isSubmitting}
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Description
					</label>
					<DebouncedTextarea
						initialValue={course?.description}
						mutationFn={updateCourse}
						mutationKey="description"
						className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm field-sizing-content resize-none"
						placeholder="Enter description..."
						disabled={isSubmitting}
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Price (in cents)
					</label>
					<DebouncedInput
						initialValue={course?.price}
						mutationFn={updateCourse}
						mutationKey="price"
						type="number"
						className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
						disabled={isSubmitting}
					/>
				</div>

				{/* --- Autosave Indicator --- */}
				<div className="pt-4 h-10">
					{isSaving && (
						<div className="flex items-center gap-2 text-sm text-gray-500">
							<Loader2 className="w-4 h-4 animate-spin" />
							<span>Saving...</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default CourseInfoEditor;
