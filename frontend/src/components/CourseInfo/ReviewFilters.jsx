import { Star, Filter } from "lucide-react";
import RadixSelect from "@/components/Shared/RadixSelect";

const SORT_OPTIONS = [
	{ label: "Mới nhất", value: "newest" },
	{ label: "Cũ nhất", value: "oldest" },
];

export default function ReviewFilters({
	ratingFilter,
	setRatingFilter,
	sort,
	setSort,
}) {
	return (
		<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
			<div className="flex flex-wrap gap-2">
				<button
					onClick={() => setRatingFilter("all")}
					className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
						ratingFilter === "all"
							? "bg-purple-600 text-white"
							: "bg-gray-100 text-gray-700 hover:bg-gray-200"
					}`}>
					<Filter className="w-3.5 h-3.5" />
					Tất cả
				</button>
				{[5, 4, 3, 2, 1].map((star) => (
					<button
						key={star}
						onClick={() => setRatingFilter(star.toString())}
						className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
							ratingFilter === star.toString()
								? "bg-purple-600 text-white"
								: "bg-gray-100 text-gray-700 hover:bg-gray-200"
						}`}>
						{star} <Star className="w-3 h-3 fill-current" />
					</button>
				))}
			</div>
			<RadixSelect
				value={sort}
				onValueChange={setSort}
				options={SORT_OPTIONS}
				className="w-[160px]"
			/>
		</div>
	);
}
