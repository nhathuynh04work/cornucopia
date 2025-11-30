import {
	FilterSidebar,
	FilterSection,
	CheckboxItem,
} from "@/components/Shared/FilterSidebar";
import { LEVEL_OPTIONS, LANGUAGE_OPTIONS } from "@/lib/constants/common";

export default function DeckFilterSidebar({
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
				{LEVEL_OPTIONS.map((opt) => (
					<CheckboxItem
						key={opt.value}
						label={opt.label}
						checked={filters.level?.includes(opt.value)}
						onChange={() => toggleFilterArray("level", opt.value)}
					/>
				))}
			</FilterSection>

			<FilterSection title="Ngôn ngữ">
				{LANGUAGE_OPTIONS.map((opt) => (
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
