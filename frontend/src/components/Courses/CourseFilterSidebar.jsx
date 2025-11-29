import { SlidersHorizontal, Star } from "lucide-react";
import {
	FilterSection,
	CheckboxItem,
	RadioItem,
} from "@/components/Shared/FilterSidebar";

export default function CourseFilterSidebar({
	filters,
	setFilter,
	toggleFilterArray,
	clearFilters,
}) {
	const hasActiveFilters =
		filters.level?.length > 0 ||
		filters.language?.length > 0 ||
		filters.rating ||
		filters.price;

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
							checked={filters.rating === rating}
							onChange={() => setFilter("rating", rating)}
							icon={
								<div className="flex gap-0.5">
									{[1, 2, 3, 4, 5].map((s) => (
										<Star
											key={s}
											className={`w-3 h-3 ${
												s <= Math.floor(rating)
													? "fill-amber-400 text-amber-400"
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
						checked={!filters.rating}
						onChange={() => setFilter("rating", null)}
					/>
				</FilterSection>

				{/* Level */}
				<FilterSection title="Trình độ">
					{[
						{ value: "ALL_LEVELS", label: "Tất cả trình độ" },
						{ value: "BEGINNER", label: "Cơ bản" },
						{ value: "INTERMEDIATE", label: "Trung cấp" },
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

				{/* Language */}
				<FilterSection title="Ngôn ngữ">
					{[
						{ value: "en", label: "Tiếng Anh" },
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

				{/* Price */}
				<FilterSection title="Giá khóa học">
					<RadioItem
						name="price"
						label="Tất cả"
						checked={!filters.price || filters.price === "all"}
						onChange={() => setFilter("price", "all")}
					/>
					<RadioItem
						name="price"
						label="Miễn phí"
						checked={filters.price === "free"}
						onChange={() => setFilter("price", "free")}
					/>
					<RadioItem
						name="price"
						label="Có phí"
						checked={filters.price === "paid"}
						onChange={() => setFilter("price", "paid")}
					/>
				</FilterSection>
			</div>
		</div>
	);
}
