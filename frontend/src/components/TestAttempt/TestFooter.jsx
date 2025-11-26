import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TestFooter({ currentIdx, totalQuestions, onNavClick }) {
	return (
		<div className="flex-none bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
			<div className="max-w-[1800px] mx-auto flex items-center justify-between">
				<button
					onClick={() => onNavClick(Math.max(0, currentIdx - 1))}
					disabled={currentIdx === 0}
					className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm">
					<ChevronLeft className="w-5 h-5" />
					Câu trước
				</button>

				<div className="hidden sm:block text-sm font-bold text-gray-500">
					Câu {currentIdx + 1} / {totalQuestions}
				</div>

				<button
					onClick={() =>
						onNavClick(Math.min(totalQuestions - 1, currentIdx + 1))
					}
					disabled={currentIdx === totalQuestions - 1}
					className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-700 hover:shadow-md disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed transition-all shadow-sm">
					Câu tiếp theo
					<ChevronRight className="w-5 h-5" />
				</button>
			</div>
		</div>
	);
}
