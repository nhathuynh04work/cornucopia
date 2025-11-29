import {
	FilterSidebar,
	FilterSection,
	CheckboxItem,
} from "@/components/Shared/FilterSidebar";

export default function TestFilterSidebar({
	filters,
	toggleFilterArray,
	clearFilters,
}) {
	const hasActiveFilters =
		filters.level?.length > 0 || filters.language?.length > 0;

	return (
		<FilterSidebar
			onClear={clearFilters}
			hasActiveFilters={hasActiveFilters}>
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
						onChange={() => toggleFilterArray("level", opt.value)}
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
		</FilterSidebar>
	);
}
