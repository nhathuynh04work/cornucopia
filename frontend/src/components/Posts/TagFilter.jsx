import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

export default function TagFilter({
	tags,
	activeTag,
	onSelect,
	hasNextPage,
	fetchNextPage,
	isFetchingNextPage,
}) {
	const loadMoreRef = useRef(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasNextPage) {
					fetchNextPage();
				}
			},
			{ root: null, rootMargin: "0px 100px 0px 0px", threshold: 0.1 }
		);

		const currentLoadMore = loadMoreRef.current;

		if (currentLoadMore) {
			observer.observe(currentLoadMore);
		}

		return () => {
			if (currentLoadMore) {
				observer.unobserve(currentLoadMore);
			}
		};
	}, [hasNextPage, fetchNextPage]);

	if (!tags && !isFetchingNextPage) return null;

	return (
		<div className="mb-4">
			<div className="flex items-center gap-2 overflow-x-auto scroll-container pb-2">
				<span className="text-sm font-medium text-gray-500 mr-2 shrink-0">
					Chủ đề:
				</span>

				{/* "All" Button */}
				<button
					onClick={() => onSelect(null)}
					className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap ${
						!activeTag
							? "bg-purple-600 text-white border-purple-600"
							: "bg-white text-gray-600 border-gray-200 hover:border-purple-200 hover:text-purple-600"
					}`}>
					Tất cả
				</button>

				{/* Tag List */}
				{tags.map((tag) => (
					<button
						key={tag.id}
						onClick={() => onSelect(tag.name)}
						className={`group px-3 py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap flex items-center gap-1.5 ${
							activeTag === tag.name
								? "bg-purple-600 text-white border-purple-600"
								: "bg-white text-gray-600 border-gray-200 hover:border-purple-200 hover:text-purple-600"
						}`}>
						{tag.name}
						{tag._count?.posts > 0 && (
							<span
								className={`text-[10px] px-1.5 py-0.5 rounded-full ${
									activeTag === tag.name
										? "bg-purple-500 text-white"
										: "bg-gray-100 text-gray-500 group-hover:bg-purple-50 group-hover:text-purple-600"
								}`}>
								{tag._count.posts}
							</span>
						)}
					</button>
				))}

				{/* Loading Indicator / Sentinel */}
				<div ref={loadMoreRef} className="shrink-0 pl-2">
					{isFetchingNextPage && (
						<Loader2 className="w-4 h-4 animate-spin text-purple-600" />
					)}
				</div>
			</div>
		</div>
	);
}
