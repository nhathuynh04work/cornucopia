import { CheckCircle2, XCircle } from "lucide-react";

function StudySummaryLists({
	reviewCards,
	masteredCards,
	incorrectCount,
	correctCount,
}) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full max-h-[500px] overflow-hidden">
			{/* Column 1: Needs Review */}
			<div className="flex flex-col h-full min-h-0">
				{/* Header */}
				<div className="flex items-center justify-between mb-3 pb-2 border-b border-red-100 shrink-0">
					<h4 className="font-bold text-red-500 flex items-center gap-2 text-sm uppercase tracking-wide">
						<XCircle className="w-4 h-4" /> Cần ôn lại
					</h4>
					<span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-md text-xs font-bold">
						{incorrectCount}
					</span>
				</div>

				{/* List */}
				<div className="flex-1 min-h-0 space-y-2 scroll-container">
					{reviewCards.length > 0 ? (
						reviewCards.map((card, idx) => (
							<div
								key={idx}
								className="p-3 bg-red-50/50 border border-red-100 rounded-lg hover:bg-red-50 transition-colors">
								<p className="font-semibold text-gray-900 text-sm mb-1">
									{card.term}
								</p>
								<p className="text-gray-500 text-xs line-clamp-2">
									{card.definition}
								</p>
							</div>
						))
					) : (
						<div className="text-center py-8 text-gray-400 text-sm italic">
							Tuyệt vời! Không có thẻ nào sai.
						</div>
					)}
				</div>
			</div>

			{/* Column 2: Mastered */}
			<div className="flex flex-col h-full min-h-0">
				<div className="flex items-center justify-between mb-3 pb-2 border-b border-green-100 shrink-0">
					<h4 className="font-bold text-green-600 flex items-center gap-2 text-sm uppercase tracking-wide">
						<CheckCircle2 className="w-4 h-4" /> Đã thuộc
					</h4>
					<span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-md text-xs font-bold">
						{correctCount}
					</span>
				</div>

				<div className="flex-1 min-h-0 space-y-2 scroll-container">
					{masteredCards.length > 0 ? (
						masteredCards.map((card, idx) => (
							<div
								key={idx}
								className="p-3 bg-green-50/50 border border-green-100 rounded-lg hover:bg-green-50 transition-colors">
								<p className="font-semibold text-gray-900 text-sm mb-1">
									{card.term}
								</p>
								<p className="text-gray-500 text-xs line-clamp-2">
									{card.definition}
								</p>
							</div>
						))
					) : (
						<div className="text-center py-8 text-gray-400 text-sm italic">
							Chưa thuộc thẻ nào. Cố lên!
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default StudySummaryLists;
