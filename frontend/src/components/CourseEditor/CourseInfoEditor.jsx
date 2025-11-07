import { Loader2 } from "lucide-react";
import { useCourseEditorStore } from "../../store/courseEditorStore";
import DebouncedInput from "../../components/DebouncedInput";
import DebouncedTextarea from "../../components/TestEditor/TestEditor/DebouncedTextarea";
import CourseCoverUploader from "./CourseCoverUploader";
import { useUpdateCourse } from "@/hooks/useCourseMutation";

function CourseInfoEditor() {
	const course = useCourseEditorStore((s) => s.course);

	const { mutate: updateCourse, isPending: isUpdating } =
		useUpdateCourse(course?.id);

	const isBusy = isUpdating;

	if (!course) return;

	return (
		<div className="max-w-2xl space-y-6">
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Cover Image
				</label>
				<CourseCoverUploader course={course} />
			</div>

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
						disabled={isBusy}
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
						disabled={isBusy}
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
						disabled={isBusy}
					/>
				</div>

				{/* --- Autosave Indicator --- */}
				<div className="pt-4 h-10">
					{isBusy && (
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
