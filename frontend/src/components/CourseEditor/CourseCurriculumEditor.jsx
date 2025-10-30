import { useAddModuleMutation } from "@/hooks/useCourseMutation";
import { useCourseEditorStore } from "@/store/courseEditorStore";
import { Plus, Loader2 } from "lucide-react";
import ModuleItem from "./ModuleItem";

function CourseCurriculumEditor() {
	const course = useCourseEditorStore((s) => s.course);

	const { mutate: addModule, isPending: isAdding } = useAddModuleMutation(
		course?.id
	);

	return (
		<div className="max-w-3xl">
			<p className="mb-6 text-gray-600">
				Start building your course by adding modules and lessons.
			</p>
			<div className="space-y-6">
				{course?.modules.map((module) => (
					<ModuleItem key={module.id} module={module} />
				))}
			</div>

			{/* Add Module Button */}
			<button
				onClick={addModule}
				disabled={isAdding}
				className="mt-6 flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-700 rounded-md disabled:bg-purple-400">
				{isAdding ? (
					<Loader2 className="w-4 h-4 animate-spin" />
				) : (
					<Plus className="w-4 h-4" />
				)}
				{isAdding ? "Adding..." : "Add Module"}
			</button>
		</div>
	);
}

export default CourseCurriculumEditor;
