import { useAddLesson } from "@/hooks/useModuleMutation";
import { Plus } from "lucide-react";
import LessonItem from "./LessonItem";

export default function LessonList({ module }) {
	const { mutate: addLesson, isPending } = useAddLesson(module.id);

	const lessons = module.lessons.sort((a, b) => a.sortOrder - b.sortOrder);

	return (
		<ul className="p-4 space-y-3">
			{lessons.map((lesson) => (
				<LessonItem key={lesson.id} lesson={lesson} />
			))}

			{/* Add Lesson Button */}
			<button
				onClick={addLesson}
				disabled={isPending}
				className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-700">
				<Plus className="w-4 h-4" />
				{isPending ? "Adding..." : "Add Lesson"}
			</button>
		</ul>
	);
}
