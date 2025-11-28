import { useState } from "react";
import {
	Video,
	FileText,
	Plus,
	Trash2,
	ChevronRight,
	ChevronDown,
} from "lucide-react";
import clsx from "clsx";

export const SidebarLessonItem = ({ lesson, index, onClick, onDelete }) => {
	const Icon = lesson.type === "VIDEO" ? Video : FileText;
	return (
		<div
			onClick={onClick}
			className="pl-12 pr-4 py-2 flex items-start justify-between group cursor-pointer hover:bg-gray-50 transition-all border-l-[3px] border-transparent text-gray-600">
			<div className="flex gap-3 overflow-hidden min-w-0">
				<Icon className="w-3.5 h-3.5 shrink-0 text-gray-400 mt-0.5" />
				<div className="flex flex-col min-w-0">
					<span className="text-xs font-medium truncate leading-tight group-hover:text-purple-700 transition-colors">
						<span className="text-gray-400 font-normal mr-1 group-hover:text-purple-400">
							Bài {index}:
						</span>
						{lesson.title}
					</span>
					<span className="text-[10px] text-gray-400 mt-0.5 font-medium">
						{lesson.duration} phút
					</span>
				</div>
			</div>
			<button
				onClick={(e) => {
					e.stopPropagation();
					onDelete(lesson.id);
				}}
				className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all shrink-0">
				<Trash2 className="w-3 h-3" />
			</button>
		</div>
	);
};

export const SidebarModuleItem = ({
	module,
	index,
	lessonMap,
	activeItemId,
	onSelect,
	onAddLesson,
	onDeleteModule,
	onDeleteLesson,
}) => {
	const [isExpanded, setIsExpanded] = useState(true);
	const isModuleActive =
		activeItemId === `module-${module.id}` ||
		module.lessons.some((l) => activeItemId === `lesson-${l.id}`);

	return (
		<div className="border-b border-gray-100 last:border-0">
			<div
				className={clsx(
					"flex items-start gap-3 px-5 py-4 cursor-pointer group transition-all select-none relative",
					isModuleActive ? "bg-purple-50/60" : "hover:bg-gray-50"
				)}
				onClick={() => onSelect(`module-${module.id}`)}>
				{isModuleActive && (
					<div className="absolute left-0 top-0 bottom-0 w-[3px] bg-purple-600" />
				)}
				<button
					onClick={(e) => {
						e.stopPropagation();
						setIsExpanded(!isExpanded);
					}}
					className="mt-0.5 text-gray-400 hover:text-gray-600 transition-colors shrink-0">
					{isExpanded ? (
						<ChevronDown className="w-3.5 h-3.5" />
					) : (
						<ChevronRight className="w-3.5 h-3.5" />
					)}
				</button>
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 mb-0.5">
						<span
							className={clsx(
								"text-[9px] font-bold uppercase tracking-wider",
								isModuleActive
									? "text-purple-600"
									: "text-gray-400"
							)}>
							CHƯƠNG {index}
						</span>
						<span className="text-[9px] text-gray-300">•</span>
						<span className="text-[9px] text-gray-400 font-medium">
							{module.lessons.length} bài
						</span>
					</div>
					<h3
						className={clsx(
							"text-sm font-bold truncate transition-colors leading-snug",
							isModuleActive ? "text-gray-900" : "text-gray-700"
						)}>
						{module.title}
					</h3>
				</div>
				<div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1 shrink-0 -mr-1">
					<button
						onClick={(e) => {
							e.stopPropagation();
							onAddLesson(module.id);
						}}
						className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all">
						<Plus className="w-3.5 h-3.5" />
					</button>
					<button
						onClick={(e) => {
							e.stopPropagation();
							onDeleteModule(module.id);
						}}
						className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
						<Trash2 className="w-3.5 h-3.5" />
					</button>
				</div>
			</div>
			<div
				className={clsx(
					"grid transition-[grid-template-rows] duration-300 ease-in-out",
					isExpanded
						? "grid-rows-[1fr] opacity-100"
						: "grid-rows-[0fr] opacity-0"
				)}>
				<div className="overflow-hidden">
					{module.lessons.map((lesson) => (
						<SidebarLessonItem
							key={lesson.id}
							lesson={lesson}
							index={lessonMap[lesson.id]}
							onClick={() => onSelect(`lesson-${lesson.id}`)}
							onDelete={onDeleteLesson}
						/>
					))}
				</div>
			</div>
		</div>
	);
};
