import { Loader2 } from "lucide-react";
import { useUpdateCourseMutation } from "@/hooks/useCourseMutation";
import DebouncedInput from "@/components/DebouncedInput";
import DebouncedTextarea from "../TestEditor/TestEditor/DebouncedTextarea";
import { useCourseEditorStore } from "@/store/courseEditorStore";
import PropertyMediaUploader from "../Media/PropertyMediaUploader";

function CourseInfoEditor() {
	const course = useCourseEditorStore((s) => s.course);
	const changeCoverUrl = useCourseEditorStore((s) => s.changeCoverUrl);

	const { mutate: updateCourse, isPending: isUpdating } =
		useUpdateCourseMutation(course?.id);

	if (!course) return;

	return (
		<div className="max-w-2xl space-y-6">
			<PropertyMediaUploader
				label="Cover Image"
				currentMediaUrl={course.coverUrl}
				entityId={course.id}
				entityType="course"
				property="coverUrl"
				onSuccess={changeCoverUrl}
				mediaType="image"
				aspectRatio="aspect-video"
				disabled={isUpdating}
			/>

			{/* --- Text Fields Form --- */}
			<div className="space-y-6">
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Course Name
					</label>
					<DebouncedInput
						initialValue={course.name}
						mutationFn={updateCourse}
						mutationKey="name"
						className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
						placeholder="Enter course name..."
						disabled={isUpdating}
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Description
					</label>
					<DebouncedTextarea
						initialValue={course.description}
						mutationFn={updateCourse}
						mutationKey="description"
						className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm field-sizing-content resize-none"
						placeholder="Enter description..."
						disabled={isUpdating}
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Price (in cents)
					</label>
					<DebouncedInput
						initialValue={course.price}
						mutationFn={updateCourse}
						mutationKey="price"
						type="number"
						className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
						disabled={isUpdating}
					/>
				</div>

				{/* --- Autosave Indicator --- */}
				<div className="pt-4 h-10">
					{isUpdating && (
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
