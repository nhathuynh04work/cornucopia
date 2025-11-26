import { useEffect } from "react";
import { X } from "lucide-react";
import DetailedQuestionView from "./DetailedQuestionView";

export default function ResultDetailsModal({ context, onClose }) {
	const items = context.items || [];
	const startIndex = context.startIndex || 1;

	// Sort items by sortOrder if available
	const sortedItems = [...items].sort(
		(a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
	);

	// Lock body scroll when modal is active
	useEffect(() => {
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "unset";
		};
	}, []);

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
			{/* Backdrop with blur effect */}
			<div
				className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300"
				onClick={onClose}
			/>

			{/* Modal Container */}
			<div className="relative flex flex-col w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden ring-1 ring-gray-900/5 animate-in zoom-in-95 fade-in duration-300">
				{/* --- Header --- */}
				<div className="flex-none px-6 py-5 border-b border-gray-100 bg-white flex items-center justify-between z-10">
					<div>
						<h3 className="text-xl font-bold text-gray-900">
							Chi tiết câu hỏi
						</h3>
						<p className="text-sm text-gray-500 mt-0.5">
							Xem lại kết quả và đáp án chi tiết cho nhóm câu hỏi
							này.
						</p>
					</div>
					<button
						onClick={onClose}
						className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
						title="Đóng">
						<X className="w-6 h-6" />
					</button>
				</div>

				{/* --- Scrollable Content --- */}
				<div className="flex-1 overflow-y-auto scroll-container bg-gray-50 p-6">
					<div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
						<div className="divide-y divide-gray-100">
							{sortedItems.map((question, idx) => (
								<DetailedQuestionView
									key={question.id}
									question={question}
									index={startIndex + idx}
								/>
							))}
						</div>
					</div>
				</div>

				{/* --- Footer --- */}
				<div className="flex-none p-4 bg-white border-t border-gray-100 flex justify-end">
					<button
						onClick={onClose}
						className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl shadow-sm shadow-purple-200 transition-all">
						Đóng
					</button>
				</div>
			</div>
		</div>
	);
}
