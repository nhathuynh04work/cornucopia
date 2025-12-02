import { useEffect, useRef } from "react";
import { GripVertical, Plus } from "lucide-react";
import LessonCardEditor from "./LessonCard";

export default function ModuleView({
	module,
	index,
	courseStatus,
	lessonMap,
	activeItemId,
	onUpdateModule,
	onUpdateLesson,
	onDeleteLesson,
	onAddLesson,
}) {
	const lessonRefs = useRef({});

	useEffect(() => {
		if (activeItemId?.startsWith("lesson-")) {
			const lessonId = parseInt(activeItemId.split("-")[1]);
			const el = lessonRefs.current[lessonId];
			if (el) {
				el.scrollIntoView({ behavior: "smooth", block: "center" });
			}
		}
	}, [activeItemId]);

	return (
		<div className="max-w-4xl mx-auto pb-20 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
			{/* Module Header */}
			<div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-none text-center">
				<div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-purple-600 shadow-sm">
					<GripVertical className="w-7 h-7" />
				</div>
				<div className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-2">
					Chương {index}
				</div>
				<input
					value={module.title}
					onChange={(e) => onUpdateModule("title", e.target.value)}
					className="w-full text-center font-bold text-2xl text-gray-900 border-none focus:ring-0 outline-none bg-transparent placeholder:text-gray-300"
					placeholder="Tên chương..."
				/>
				<p className="text-sm text-gray-500 mt-2">
					{module.lessons.length} bài học
				</p>
			</div>

			{/* Lesson List */}
			<div className="space-y-4">
				{module.lessons.map((lesson) => (
					<LessonCardEditor
						key={lesson.id}
						lesson={lesson}
						courseStatus={courseStatus}
						index={lessonMap[lesson.id]}
						isActive={activeItemId === `lesson-${lesson.id}`}
						cardRef={(el) => (lessonRefs.current[lesson.id] = el)}
						onChange={(updates) =>
							onUpdateLesson(lesson.id, updates)
						}
						onDelete={() => onDeleteLesson(lesson.id)}
					/>
				))}

				{module.lessons.length === 0 && (
					<div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
						<p className="text-gray-400 text-sm">
							Chưa có bài học nào trong chương này.
						</p>
					</div>
				)}
			</div>

			{/* Add Lesson Button */}
			<button
				onClick={() => onAddLesson(module.id)}
				className="w-full py-4 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 text-gray-500 font-bold hover:text-purple-600 hover:border-purple-200 hover:bg-purple-50 transition-all flex items-center justify-center gap-2 group text-sm">
				<Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
				Thêm bài học mới
			</button>
		</div>
	);
}
