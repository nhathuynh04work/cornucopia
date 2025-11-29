import { Star, SlidersHorizontal } from "lucide-react";
import {
	FilterSection,
	CheckboxItem,
	RadioItem,
} from "@/components/Shared/FilterSidebar";
import { LEVEL_OPTIONS, LANGUAGE_OPTIONS } from "@/lib/constants/course";

export default function CourseFilterSidebar({
	filters,
	toggleFilterArray,
	setFilter,
	clearFilters,
}) {
	const selectedLevels = filters.level || [];
	const selectedLanguages = filters.language || [];
	const minRating = filters.rating || null;
	const priceFilter = filters.price || "all";

	const hasActiveFilters =
		selectedLevels.length > 0 ||
		selectedLanguages.length > 0 ||
		minRating ||
		priceFilter !== "all";

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
				{/* Ratings */}
				<FilterSection title="Đánh giá">
					{[4.5, 4.0, 3.5, 3.0].map((rating) => (
						<RadioItem
							key={rating}
							name="rating"
							label={`Từ ${rating} sao`}
							checked={minRating === rating}
							onChange={() => setFilter("rating", rating)}
							icon={
								<div className="flex gap-0.5">
									{[1, 2, 3, 4, 5].map((s) => (
										<Star
											key={s}
											className={`w-3 h-3 ${
												s <= Math.floor(rating)
													? "fill-amber-400 text-amber-400"
													: s === Math.ceil(rating) &&
													  rating % 1 !== 0
													? "fill-amber-400 text-amber-400 opacity-50"
													: "text-gray-300"
											}`}
										/>
									))}
								</div>
							}
						/>
					))}
					<RadioItem
						name="rating"
						label="Tất cả"
						checked={minRating === null}
						onChange={() => setFilter("rating", null)}
					/>
				</FilterSection>

				{/* Level */}
				<FilterSection title="Trình độ">
					{LEVEL_OPTIONS.map((opt) => (
						<CheckboxItem
							key={opt.value}
							label={opt.label}
							checked={selectedLevels.includes(opt.value)}
							onChange={() =>
								toggleFilterArray("level", opt.value)
							}
						/>
					))}
				</FilterSection>

				{/* Language */}
				<FilterSection title="Ngôn ngữ">
					{LANGUAGE_OPTIONS.map((opt) => (
						<CheckboxItem
							key={opt.value}
							label={opt.label}
							checked={selectedLanguages.includes(opt.value)}
							onChange={() =>
								toggleFilterArray("language", opt.value)
							}
						/>
					))}
				</FilterSection>

				{/* Price */}
				<FilterSection title="Giá khóa học">
					<RadioItem
						name="price"
						label="Tất cả"
						checked={priceFilter === "all"}
						onChange={() => setFilter("price", "all")}
					/>
					<RadioItem
						name="price"
						label="Miễn phí"
						checked={priceFilter === "free"}
						onChange={() => setFilter("price", "free")}
					/>
					<RadioItem
						name="price"
						label="Có phí"
						checked={priceFilter === "paid"}
						onChange={() => setFilter("price", "paid")}
					/>
				</FilterSection>
			</div>
		</div>
	);
}
