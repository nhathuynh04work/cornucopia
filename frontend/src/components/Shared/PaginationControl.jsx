import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PaginationControl({
	currentPage,
	totalPages,
	onPageChange,
}) {
	if (totalPages <= 1) return null;

	return (
		<div className="mt-8 flex items-center justify-center gap-2">
			<button
				onClick={() => onPageChange(Math.max(1, currentPage - 1))}
				disabled={currentPage === 1}
				className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
				<ChevronLeft className="w-5 h-5" />
			</button>

			{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
				<button
					key={page}
					onClick={() => onPageChange(page)}
					className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
						currentPage === page
							? "bg-purple-600 text-white shadow-lg shadow-purple-200"
							: "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-purple-200"
					}`}>
					{page}
				</button>
			))}

			<button
				onClick={() =>
					onPageChange(Math.min(totalPages, currentPage + 1))
				}
				disabled={currentPage === totalPages}
				className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
				<ChevronRight className="w-5 h-5" />
			</button>
		</div>
	);
}
