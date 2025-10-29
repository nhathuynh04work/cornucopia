import { useCourseEditorStore } from "@/store/courseEditorStore";
import {
	Plus,
	GripVertical,
	FileText,
	Video,
	Trash2,
	Edit,
} from "lucide-react";

function CourseCurriculumEditor() {
	const course = useCourseEditorStore((s) => s.course);
    
	const lessonIcon = {
		VIDEO: <Video className="w-4 h-4 text-purple-600" />,
		TEXT: <FileText className="w-4 h-4 text-blue-600" />,
	};

	return (
		<div className="max-w-3xl">
			<p className="mb-6 text-gray-600">
				Start building your course by adding modules and lessons.
			</p>
			<div className="space-y-6">
				{/* Map over modules */}
				{course?.modules.map((module) => (
					<div
						key={module.id}
						className="rounded-lg border border-gray-200 bg-white shadow-sm">
						{/* Module Header */}
						<div className="flex items-center justify-between p-4 border-b border-gray-200">
							<div className="flex items-center gap-2">
								<GripVertical className="w-5 h-5 text-gray-400" />
								<span className="font-semibold text-gray-800">
									{module.title}
								</span>
							</div>
							<div className="flex items-center gap-3">
								<button
									onClick={() =>
										alert("Edit module placeholder")
									}>
									<Edit className="w-4 h-4 text-gray-500" />
								</button>
								<button
									onClick={() =>
										alert("Delete module placeholder")
									}>
									<Trash2 className="w-4 h-4 text-gray-500" />
								</button>
							</div>
						</div>

						{/* Lessons List */}
						<ul className="p-4 space-y-3">
							{module.lessons.map((lesson) => (
								<li
									key={lesson.id}
									className="flex items-center justify-between p-3 rounded-md border border-gray-200 bg-gray-50">
									<div className="flex items-center gap-3">
										<GripVertical className="w-5 h-5 text-gray-400" />
										{lessonIcon[lesson.type]}
										<span className="text-gray-700">
											{lesson.title}
										</span>
									</div>
									<div className="flex items-center gap-3">
										<button
											onClick={() =>
												alert("Edit lesson placeholder")
											}>
											<Edit className="w-4 h-4 text-gray-500" />
										</button>
										<button
											onClick={() =>
												alert(
													"Delete lesson placeholder"
												)
											}>
											<Trash2 className="w-4 h-4 text-gray-500" />
										</button>
									</div>
								</li>
							))}
							{/* Add Lesson Button */}
							<button
								onClick={() => alert("Add lesson placeholder")}
								className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-700">
								<Plus className="w-4 h-4" /> Add Lesson
							</button>
						</ul>
					</div>
				))}
			</div>

			{/* Add Module Button */}
			<button
				onClick={() => alert("Add module placeholder")}
				className="mt-6 flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-700 rounded-md">
				<Plus className="w-4 h-4" /> Add Module
			</button>
		</div>
	);
}

export default CourseCurriculumEditor;
