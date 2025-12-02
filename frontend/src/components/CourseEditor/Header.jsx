import { ArrowLeft, Loader2, CheckCircle2, Menu, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RadixSelect from "@/components/Shared/RadixSelect";
import { useMemo } from "react";
import { STATUS_OPTIONS } from "@/lib/constants/course";
import { getCourseStats } from "@/lib/utils/course";

export default function Header({
	course,
	isSaving,
	lastSaved,
	onStatusChange,
	onToggleSidebar,
}) {
	const navigate = useNavigate();
	const currentStatus =
		STATUS_OPTIONS.find((o) => o.value === course.status) ||
		STATUS_OPTIONS[0];
	const stats = getCourseStats(course);

	const availableStatusOptions = useMemo(() => {
		return course.status === "DRAFT"
			? STATUS_OPTIONS.filter((o) => o.value !== "ARCHIVED")
			: STATUS_OPTIONS.filter((o) => o.value !== "DRAFT");
	}, [course.status]);

	return (
		<header className="h-16 px-4 md:px-6 border-b border-gray-200 flex items-center justify-between bg-white shrink-0 z-50 sticky top-0">
			<div className="flex items-center gap-2 md:gap-4">
				<button
					onClick={onToggleSidebar}
					className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg">
					<Menu className="w-6 h-6" />
				</button>

				<button
					onClick={() => navigate(-1)}
					disabled={isSaving}
					className={`hidden md:block p-2 -ml-2 rounded-lg transition-all ${
						isSaving
							? "text-gray-300 cursor-not-allowed"
							: "text-gray-400 hover:text-purple-600 hover:bg-purple-50"
					}`}>
					<ArrowLeft className="w-5 h-5" />
				</button>

				<div className="h-6 w-px bg-gray-200 mx-1 hidden md:block" />

				<div className="flex items-center gap-3">
					<div className="hidden sm:block">
						<RadixSelect
							value={course.status}
							onChange={onStatusChange}
							options={availableStatusOptions}
							icon={currentStatus.icon}
							className="w-[140px]"
							disabled={isSaving}
						/>
					</div>

					<div className="flex flex-col justify-center">
						<span className="text-sm font-bold text-gray-900 truncate max-w-[150px] sm:max-w-md leading-tight">
							{course.title || (
								<span className="text-gray-300 italic">
									Chưa có tiêu đề
								</span>
							)}
						</span>
						<div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
							<span>{stats.totalLessons} bài học</span>
							<div className="w-1 h-1 rounded-full bg-gray-300" />
							<span className="flex items-center gap-1">
								<Clock className="w-3 h-3" /> {stats.timeString}
							</span>
						</div>
					</div>
				</div>
			</div>

			<div className="flex items-center gap-4">
				<div className="hidden lg:flex items-center gap-2 text-xs font-medium text-gray-500 border-r border-gray-200 pr-4 h-8">
					{isSaving ? (
						<span className="flex items-center gap-1.5 text-purple-600 animate-pulse">
							<Loader2 className="w-3 h-3 animate-spin" /> Đang
							lưu...
						</span>
					) : (
						<span className="flex items-center gap-1.5 text-green-600">
							<CheckCircle2 className="w-3.5 h-3.5" />
							{lastSaved
								? `Đã lưu ${lastSaved.toLocaleTimeString(
										"vi-VN",
										{ hour: "2-digit", minute: "2-digit" }
								  )}`
								: "Đã lưu"}
						</span>
					)}
				</div>

				<button
					onClick={() => navigate(-1)}
					disabled={isSaving}
					className={`px-3 md:px-5 py-2 text-white text-sm font-bold rounded-lg shadow-sm transition-all flex items-center gap-2 ${
						isSaving
							? "bg-purple-300 cursor-not-allowed"
							: "bg-purple-600 hover:bg-purple-700"
					}`}>
					<span className="hidden sm:inline">Hoàn tất</span>
					<span className="sm:hidden">Xong</span>
				</button>
			</div>
		</header>
	);
}
