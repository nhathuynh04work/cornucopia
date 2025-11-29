import { SlidersHorizontal } from "lucide-react";
import { FilterSection, CheckboxItem } from "@/components/Shared/FilterSidebar";

export default function TestFilterSidebar({
	filters,
	toggleFilterArray,
	clearFilters,
}) {
	const hasActiveFilters =
		filters.level?.length > 0 || filters.language?.length > 0;

	return (
		<div className="flex flex-col h-full">
			<div className="flex items-center justify-between mb-4 shrink-0">
				<h2 className="font-bold text-lg flex items-center gap-2 text-gray-900">
					<SlidersHorizontal className="w-5 h-5 text-purple-600" />
					Bộ lọc
				</h2>
				{hasActiveFilters && (
					<button
						onClick={clearFilters}
						className="text-xs font-semibold text-purple-600 hover:text-purple-700 hover:underline">
						Xóa tất cả
					</button>
				)}
			</div>

			<div className="flex-1 overflow-y-auto pr-1 space-y-1 scroll-container hide-scrollbar">
				<FilterSection title="Trình độ">
					{[
						{ value: "ALL_LEVELS", label: "Tất cả trình độ" },
						{ value: "BEGINNER", label: "Cơ bản" },
						{ value: "INTERMEDIATE", label: "Trung bình" },
						{ value: "ADVANCED", label: "Nâng cao" },
					].map((opt) => (
						<CheckboxItem
							key={opt.value}
							label={opt.label}
							checked={filters.level?.includes(opt.value)}
							onChange={() =>
								toggleFilterArray("level", opt.value)
							}
						/>
					))}
				</FilterSection>

				<FilterSection title="Ngôn ngữ">
					{[
						{ value: "en", label: "Tiếng Anh" },
						{ value: "vi", label: "Tiếng Việt" },
						{ value: "ja", label: "Tiếng Nhật" },
						{ value: "ko", label: "Tiếng Hàn" },
						{ value: "zh", label: "Tiếng Trung" },
					].map((opt) => (
						<CheckboxItem
							key={opt.value}
							label={opt.label}
							checked={filters.language?.includes(opt.value)}
							onChange={() =>
								toggleFilterArray("language", opt.value)
							}
						/>
					))}
				</FilterSection>
			</div>
		</div>
	);
}
