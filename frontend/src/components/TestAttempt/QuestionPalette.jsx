import { X } from "lucide-react";
import { cn } from "@/lib/formatters";

export default function QuestionPalette({
	questions,
	answers,
	flagged,
	currentIdx,
	onNavClick,
	isOpen,
	onClose,
}) {
	// Determine the current question to check for group membership
	const currentQuestion = questions[currentIdx];

	// Shared content for both desktop and mobile render
	const PaletteContent = () => (
		<div className="flex flex-col h-full">
			<div className="flex items-center justify-between mb-6 flex-none">
				<h3 className="font-bold text-lg text-gray-900">
					Danh sách câu hỏi
				</h3>
				{onClose && (
					<button
						onClick={onClose}
						className="p-2 bg-gray-100 rounded-full xl:hidden">
						<X className="w-5 h-5 text-gray-600" />
					</button>
				)}
			</div>

			<div className="flex-1 overflow-y-auto hide-scrollbar p-1">
				<div className="grid grid-cols-4 xl:grid-cols-4 lg:grid-cols-5 gap-2">
					{questions.map((q, idx) => {
						const isDone =
							answers[q.id] !== undefined && answers[q.id] !== "";

						// Active if it matches the current index OR belongs to the same group
						const isActive =
							idx === currentIdx ||
							(currentQuestion?.parentId &&
								q.parentId === currentQuestion.parentId);

						const isFlag = flagged.includes(q.id);

						return (
							<button
								key={q.id}
								onClick={() => {
									onNavClick(idx);
									if (onClose) onClose();
								}}
								className={cn(
									"relative h-9 w-full rounded-lg text-xs font-bold transition-all border",
									isActive &&
										"!border-purple-600 border-2 z-10 shadow-sm",
									isDone
										? "bg-purple-100 text-purple-900 border-purple-200 hover:bg-purple-200"
										: "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
								)}>
								{q.displayNumber || idx + 1}
								{isFlag && (
									<div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border border-white" />
								)}
							</button>
						);
					})}
				</div>
			</div>

			{onClose && (
				<div className="pt-6 border-t border-gray-100 flex-none mt-auto">
					<button className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl shadow-lg">
						Nộp bài thi
					</button>
				</div>
			)}
		</div>
	);

	// Desktop Sidebar
	if (!onClose) {
		return (
			<div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 h-full overflow-hidden">
				<PaletteContent />
			</div>
		);
	}

	// Mobile Drawer
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-[60] xl:hidden">
			<div
				className="absolute inset-0 bg-black/50 backdrop-blur-sm"
				onClick={onClose}
			/>
			<div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl p-6 flex flex-col animate-in slide-in-from-right duration-300">
				<PaletteContent />
			</div>
		</div>
	);
}
