import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import {
	FilterSidebar,
	FilterSection,
} from "@/components/Shared/FilterSidebar";
import { useInfiniteTags } from "@/hooks/useTagQuery";

function useDebounceValue(value, delay) {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
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

	const renderTagPill = (name, count, isSelected) => (
		<button
			key={name}
			onClick={() => toggleFilterArray("tags", name)}
			className={`
				inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all
				${
					isSelected
						? "bg-purple-600 text-white border-purple-600 hover:bg-purple-700"
						: "bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-600"
				}
			`}>
			<span>{name}</span>
			{count !== undefined && (
				<span
					className={`ml-0.5 text-[10px] ${
						isSelected ? "text-purple-200" : "text-gray-400"
					}`}>
					{count}
				</span>
			)}
		</button>
	);

	return (
		<FilterSidebar
			onClear={clearFilters}
			hasActiveFilters={hasActiveFilters}>
			<FilterSection title="Chủ đề">
				{/* Search Bar */}
				<div className="relative mb-3 px-1">
					<input
						type="text"
						placeholder="Tìm chủ đề..."
						value={tagSearch}
						onChange={(e) => setTagSearch(e.target.value)}
						className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none bg-gray-50"
					/>
					<Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
				</div>

				{/* Tag Pills Container */}
				<div className="max-h-[300px] overflow-y-auto pr-1 hide-scrollbar">
					{isLoading ? (
						<div className="flex justify-center py-4">
							<Loader2 className="w-4 h-4 animate-spin text-purple-500" />
						</div>
					) : (
						<div className="flex flex-wrap gap-2 p-1">
							{/* 1. Render fetched tags */}
							{allTags.map((tag) =>
								renderTagPill(
									tag.name,
									tag._count?.posts,
									selectedTags.includes(tag.name)
								)
							)}

							{/* 2. Render selected tags that are NOT in the fetched list (to keep them visible) */}
							{selectedTags
								.filter(
									(tName) =>
										!allTags.find((t) => t.name === tName)
								)
								.map((tName) =>
									renderTagPill(tName, undefined, true)
								)}

							{/* Empty State */}
							{!isLoading && allTags.length === 0 && (
								<div className="w-full text-xs text-gray-400 py-2 text-center">
									Không tìm thấy chủ đề
								</div>
							)}
						</div>
					)}

					{/* Load More Button */}
					{hasNextPage && (
						<button
							onClick={() => fetchNextPage()}
							disabled={isFetchingNextPage}
							className="w-full text-xs text-purple-600 font-medium py-3 hover:bg-purple-50 rounded-lg mt-2 disabled:opacity-50 transition-colors">
							{isFetchingNextPage ? "Đang tải..." : "Xem thêm"}
						</button>
					)}
				</div>
			</FilterSection>
		</FilterSidebar>
	);
}
