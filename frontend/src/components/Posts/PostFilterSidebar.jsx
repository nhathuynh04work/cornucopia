import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import {
	FilterSidebar,
	FilterSection,
	CheckboxItem,
} from "@/components/Shared/FilterSidebar";
import { useInfiniteTags } from "@/hooks/useTagQuery";

function useDebounceValue(value, delay) {
	const [debouncedValue, setDebouncedValue] = useState(value);
	useState(() => {
		const handler = setTimeout(() => setDebouncedValue(value), delay);
		return () => clearTimeout(handler);
	}, [value, delay]);
	return debouncedValue;
}

export default function PostFilterSidebar({
	filters,
	toggleFilterArray,
	clearFilters,
}) {
	const [tagSearch, setTagSearch] = useState("");
	const debouncedTagSearch = useDebounceValue(tagSearch, 500);

	const selectedTags = filters.tags || [];

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
		useInfiniteTags(debouncedTagSearch);

	const allTags = data?.pages.flatMap((page) => page.tags) || [];
	const hasActiveFilters = selectedTags.length > 0;

	return (
		<FilterSidebar
			onClear={clearFilters}
			hasActiveFilters={hasActiveFilters}>
			<FilterSection title="Chủ đề">
				<div className="relative mb-2 px-1">
					<input
						type="text"
						placeholder="Tìm chủ đề..."
						value={tagSearch}
						onChange={(e) => setTagSearch(e.target.value)}
						className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none bg-gray-50"
					/>
					<Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
				</div>

				<div className="max-h-[300px] overflow-y-auto pr-1 hide-scrollbar">
					{isLoading ? (
						<div className="flex justify-center py-4">
							<Loader2 className="w-4 h-4 animate-spin text-purple-500" />
						</div>
					) : allTags.length > 0 ? (
						<>
							{allTags.map((tag) => (
								<CheckboxItem
									key={tag.id}
									label={tag.name}
									count={tag._count?.posts}
									checked={selectedTags.includes(tag.name)}
									onChange={() =>
										toggleFilterArray("tags", tag.name)
									}
								/>
							))}
							{/* Selected tags not in list */}
							{selectedTags.length > 0 &&
								selectedTags
									.filter(
										(tName) =>
											!allTags.find(
												(t) => t.name === tName
											)
									)
									.map((tName) => (
										<CheckboxItem
											key={tName}
											label={tName}
											checked={true}
											onChange={() =>
												toggleFilterArray("tags", tName)
											}
										/>
									))}

							{hasNextPage && (
								<button
									onClick={() => fetchNextPage()}
									disabled={isFetchingNextPage}
									className="w-full text-xs text-purple-600 font-medium py-2 hover:bg-purple-50 rounded-lg mt-1 disabled:opacity-50">
									{isFetchingNextPage
										? "Đang tải..."
										: "Xem thêm"}
								</button>
							)}
						</>
					) : (
						<div className="text-xs text-gray-400 py-2 text-center">
							Không tìm thấy chủ đề
						</div>
					)}
				</div>
			</FilterSection>
		</FilterSidebar>
	);
}
