import { useMemo } from "react";
import { Settings, Plus } from "lucide-react";
import clsx from "clsx";
import { SidebarModuleItem } from "./SidebarItems";
import { getLessonIndexMap } from "@/lib/utils/course";

export default function Sidebar({
	course,
	activeItemId,
	onSelect,
	onAddModule,
	onAddLesson,
	onDeleteModule,
	onDeleteLesson,
	isOpen,
	onClose,
}) {
	const lessonMap = useMemo(
		() => getLessonIndexMap(course?.modules),
		[course?.modules]
	);

	const handleSelection = (id) => {
		onSelect(id);
		onClose(); // Close sidebar on mobile when item selected
	};

	return (
		<>
			{isOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm transition-opacity"
					onClick={onClose}
				/>
			)}

			<aside
				className={clsx(
					"fixed inset-y-0 left-0 z-40 w-80 bg-white border-r border-gray-200 flex flex-col h-full shadow-[2px_0_24px_-12px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:shadow-none",
					isOpen ? "translate-x-0" : "-translate-x-full"
				)}>
				{/* Course Info Link */}
				<div
					onClick={() => handleSelection("course-info")}
					className={clsx(
						"flex items-center gap-4 px-6 py-5 border-b border-gray-100 cursor-pointer transition-all group",
						activeItemId === "course-info"
							? "bg-purple-50/50"
							: "hover:bg-gray-50"
					)}>
					<div
						className={clsx(
							"w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border transition-all",
							activeItemId === "course-info"
								? "bg-white border-purple-200 text-purple-600 shadow-purple-100"
								: "bg-white border-gray-200 text-gray-400 group-hover:border-gray-300 group-hover:text-gray-600"
						)}>
						<Settings className="w-6 h-6" />
					</div>
					<div className="flex-1 min-w-0">
						<h2
							className={clsx(
								"text-sm font-bold truncate transition-colors",
								activeItemId === "course-info"
									? "text-purple-900"
									: "text-gray-900"
							)}>
							Thông tin chung
						</h2>
						<p className="text-[11px] text-gray-400 truncate mt-0.5 leading-relaxed">
							Thiết lập cơ bản & nâng cao
						</p>
					</div>
				</div>

				{/* Module List */}
				<div className="flex-1 overflow-y-auto scroll-container">
					<div className="flex items-center justify-between mb-2 px-4 pt-4">
						<h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
							Nội dung khóa học
						</h3>
					</div>

					{course.modules?.map((module, index) => (
						<SidebarModuleItem
							key={module.id}
							module={module}
							index={index + 1}
							lessonMap={lessonMap}
							activeItemId={activeItemId}
							onSelect={handleSelection}
							onAddLesson={onAddLesson}
							onDeleteModule={onDeleteModule}
							onDeleteLesson={onDeleteLesson}
						/>
					))}
				</div>

				{/* Add Module Button */}
				<div className="p-4 border-t border-gray-100 bg-white">
					<button
						onClick={onAddModule}
						className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-purple-200 text-sm active:scale-[0.98] border border-purple-700">
						<Plus className="w-4 h-4" />
						Thêm chương mới
					</button>
				</div>
			</aside>
		</>
	);
}
