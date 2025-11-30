import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import PaginationControl from "@/components/Shared/PaginationControl";

export default function LibrarySection({
	title,
	action,
	items = [],
	renderItem,
	itemsPerPage = 6,
	gridClass = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
	emptyMessage = "Không có dữ liệu.",
	emptyIcon: EmptyIcon = BookOpen,
}) {
	const [page, setPage] = useState(1);
	const totalPages = Math.ceil(items.length / itemsPerPage);

	useEffect(() => setPage(1), [items.length]);

	return (
		<section>
			{/* Section Header */}
			<div className="flex items-center justify-between mb-6 mt-10 first:mt-0">
				<h3 className="font-bold text-gray-900 text-xl">{title}</h3>
				{action}
			</div>

			{/* Content or Empty State */}
			{items.length === 0 ? (
				<div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
					<div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
						<EmptyIcon className="w-8 h-8" />
					</div>
					<p className="text-gray-500">{emptyMessage}</p>
				</div>
			) : (
				<div>
					<div className={gridClass}>
						{items
							.slice(
								(page - 1) * itemsPerPage,
								page * itemsPerPage
							)
							.map((item) => renderItem(item))}
					</div>

					<PaginationControl
						currentPage={page}
						totalPages={totalPages}
						onPageChange={setPage}
					/>
				</div>
			)}
		</section>
	);
}
