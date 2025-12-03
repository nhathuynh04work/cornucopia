import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TestFooter({ currentIdx, totalQuestions, onNavClick }) {
	return (
		<div className="flex-none bg-white border-t border-gray-200 p-3 md:p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
			<div className="max-w-[1800px] mx-auto flex items-center justify-between gap-4">
				<button
					onClick={() => onNavClick(Math.max(0, currentIdx - 1))}
					disabled={currentIdx === 0}
					className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-bold text-sm md:text-base text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm">
					<ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
					<span className="hidden sm:inline">Câu trước</span>
					<span className="sm:hidden">Trước</span>
				</button>

				<div className="hidden sm:block text-sm font-bold text-gray-500">
					Câu {currentIdx + 1} / {totalQuestions}
				</div>

				<button
					onClick={() =>
						onNavClick(Math.min(totalQuestions - 1, currentIdx + 1))
					}
					disabled={currentIdx === totalQuestions - 1}
					className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 md:px-8 py-2.5 md:py-3 rounded-xl font-bold text-sm md:text-base text-white bg-purple-600 hover:bg-purple-700 hover:shadow-md disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed transition-all shadow-sm">
					<span className="hidden sm:inline">Câu tiếp theo</span>
					<span className="sm:hidden">Tiếp</span>
					<ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
				</button>
			</div>
		</div>
	);
}
