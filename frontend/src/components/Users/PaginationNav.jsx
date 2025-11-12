export default function PaginationNav({
	page,
	totalPages,
	total,
	onPrev,
	onNext,
}) {
	return (
		<div className="mt-4 flex justify-between items-center text-sm text-gray-600">
			<p>
				Page {page} of {totalPages} | Total Users: {total}
			</p>
			<div className="flex gap-2">
				<button
					onClick={onPrev}
					disabled={page === 1}
					className={`px-3 py-1.5 rounded-md border text-gray-700 transition ${
						page === 1
							? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
							: "bg-white border-gray-200 hover:bg-gray-50"
					}`}>
					Prev
				</button>
				<button
					onClick={onNext}
					disabled={page === totalPages}
					className={`px-3 py-1.5 rounded-md border text-gray-700 transition ${
						page === totalPages
							? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
							: "bg-white border-gray-200 hover:bg-gray-50"
					}`}>
					Next
				</button>
			</div>
		</div>
	);
}
