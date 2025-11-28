import {
	GripVertical,
	PlayCircle,
	FileText,
	Check,
	Clock,
	Trash2,
	ChevronDown,
	Edit3,
} from "lucide-react";
import RadixSelect from "@/components/Shared/RadixSelect";
import clsx from "clsx";
import { LESSON_TYPE_OPTIONS } from "@/lib/constants/course";

const Toggle = ({ checked, onChange }) => (
	<div
		className="flex items-center gap-3 cursor-pointer select-none group"
		onClick={(e) => {
			e.stopPropagation();
			onChange(!checked);
		}}>
		<div
			className={clsx(
				"w-9 h-5 rounded-full relative transition-colors duration-200",
				checked
					? "bg-purple-600"
					: "bg-gray-200 group-hover:bg-gray-300"
			)}>
			<div
				className={clsx(
					"absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200",
					checked ? "translate-x-4" : "translate-x-0"
				)}
			/>
		</div>
	</div>
);

export default function LessonHeader({
	lesson,
	index,
	isExpanded,
	courseStatus,
	onToggleExpand,
	onChange,
	onDelete,
}) {
	return (
		<div
			className="p-4 flex items-center justify-between cursor-pointer select-none bg-white relative group"
			onClick={onToggleExpand}>
			<div className="flex items-center gap-4 flex-1 min-w-0">
				<div className="flex items-center gap-3">
					<div className="w-6 flex flex-col items-center justify-center text-gray-300 cursor-move hover:text-gray-500">
						<GripVertical className="w-4 h-4" />
					</div>
					<div
						className={clsx(
							"w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border",
							lesson.type === "VIDEO"
								? "bg-red-50 text-red-600 border-red-100"
								: "bg-blue-50 text-blue-600 border-blue-100"
						)}>
						{lesson.type === "VIDEO" ? (
							<PlayCircle className="w-5 h-5" />
						) : (
							<FileText className="w-5 h-5" />
						)}
					</div>
				</div>

				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 mb-1">
						<span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-1.5 py-0.5 rounded">
							Bài {index}
						</span>
						{lesson.videoUrl && (
							<span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded flex items-center gap-1">
								<Check className="w-3 h-3" /> Video Ready
							</span>
						)}
					</div>
					<input
						value={lesson.title}
						onClick={(e) => e.stopPropagation()}
						onChange={(e) => onChange({ title: e.target.value })}
						className="w-full font-bold text-gray-900 border-none p-0 focus:ring-0 outline-none text-base placeholder:text-gray-300 bg-transparent truncate"
						placeholder="Tiêu đề bài học..."
					/>
				</div>
			</div>

			<div className="flex items-center gap-2 sm:gap-6 pl-4 border-l border-gray-100 ml-2 sm:ml-4">
				<div
					className="hidden sm:flex flex-col items-end gap-1 min-w-[80px]"
					onClick={(e) => e.stopPropagation()}>
					<div className="flex items-center gap-1 text-xs text-gray-500">
						<Clock className="w-3 h-3" /> {lesson.duration}m
					</div>
					<RadixSelect
						value={lesson.type}
						onChange={(val) => onChange({ type: val })}
						options={LESSON_TYPE_OPTIONS}
						className="h-8 w-[110px] text-xs"
					/>
				</div>

				{courseStatus !== "DRAFT" && (
					<div
						className="flex flex-col items-center gap-1 w-12 shrink-0"
						onClick={(e) => e.stopPropagation()}>
						<Toggle
							checked={lesson.isPublished}
							onChange={(val) => onChange({ isPublished: val })}
						/>
						<span
							className={clsx(
								"text-[9px] font-bold uppercase",
								lesson.isPublished
									? "text-purple-600"
									: "text-gray-400"
							)}>
							{lesson.isPublished ? "Đã đăng" : "Ẩn"}
						</span>
					</div>
				)}

				<div className="flex items-center gap-1">
					<button
						onClick={(e) => {
							e.stopPropagation();
							onDelete();
						}}
						className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full">
						<Trash2 className="w-4 h-4" />
					</button>
					<button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full">
						{isExpanded ? (
							<ChevronDown className="w-5 h-5" />
						) : (
							<Edit3 className="w-4 h-4" />
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
