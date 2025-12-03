import { useRef, useEffect } from "react";
import { Flag } from "lucide-react";
import { cn } from "@/lib/formatters";
import MediaAttachment from "./MediaAttachment";

export default function QuestionCard({
	question,
	answer,
	onAnswer,
	onFlag,
	isFlagged,
	isActive,
}) {
	const cardRef = useRef(null);

	useEffect(() => {
		if (isActive && cardRef.current) {
			const rect = cardRef.current.getBoundingClientRect();
			const isInView =
				rect.top >= 100 && rect.bottom <= window.innerHeight;

			if (!isInView) {
				cardRef.current.scrollIntoView({
					behavior: "smooth",
					block: "center",
				});
			}
		}
	}, [isActive]);

	return (
		<div
			ref={cardRef}
			className={cn(
				"bg-white rounded-2xl border transition-all duration-300 flex flex-col",
				// Responsive padding
				"p-5 md:p-8",
				"border-gray-200 shadow-sm hover:border-purple-100"
			)}>
			{/* Header */}
			<div className="flex items-start justify-between gap-4 mb-4">
				<div className="w-full min-w-0">
					<span
						className={cn(
							"inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider mb-3 transition-colors",
							"bg-gray-100 text-gray-600"
						)}>
						Câu {question.displayNumber || question.index + 1}
						<span className="w-1 h-1 rounded-full bg-current opacity-50" />
						{question.points} điểm
					</span>
					<h3
						className="prose prose-sm md:prose-md focus:outline-none px-2 md:px-4 py-2 md:py-3 text-gray-700 max-w-none w-full
					prose-headings:mb-2 prose-headings:mt-2 prose-p:my-1 prose-p:leading-normal
					prose-blockquote:border-l-4 prose-blockquote:!border-purple-200 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-500"
						dangerouslySetInnerHTML={{ __html: question.text }}
					/>
				</div>
				<button
					onClick={onFlag}
					className={cn(
						"flex-shrink-0 p-2 md:p-2.5 rounded-full transition-all border",
						isFlagged
							? "bg-amber-50 text-amber-600 border-amber-200"
							: "bg-white text-gray-400 border-transparent hover:bg-gray-50"
					)}
					title="Đánh dấu câu hỏi này">
					<Flag
						className={cn(
							"w-4 h-4 md:w-5 md:h-5",
							isFlagged && "fill-current"
						)}
					/>
				</button>
			</div>

			<MediaAttachment mediaList={question.mediaUrls} />

			{/* Answer Inputs */}
			<div className="mt-2 flex-1">
				{question.type === "MULTIPLE_CHOICE" && (
					<div className="space-y-2 md:space-y-3">
						{question.answerOptions.map((opt) => {
							const isSelected = Array.isArray(answer)
								? answer.includes(opt.id)
								: answer === opt.id;
							return (
								<div
									key={opt.id}
									onClick={() => onAnswer(opt.id)}
									className={cn(
										"group relative p-3 md:p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center gap-3 md:gap-4",
										isSelected
											? "border-purple-600 bg-purple-50/50"
											: "border-gray-200 hover:border-purple-200 hover:bg-gray-50"
									)}>
									<div
										className={cn(
											"w-4 h-4 md:w-5 md:h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
											isSelected
												? "border-purple-600 bg-purple-600 text-white"
												: "border-gray-300 group-hover:border-purple-300"
										)}>
										{isSelected && (
											<div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full" />
										)}
									</div>
									<span
										className={cn(
											"font-medium text-sm md:text-base transition-colors",
											isSelected
												? "text-purple-900"
												: "text-gray-700"
										)}>
										{opt.text}
									</span>
								</div>
							);
						})}
					</div>
				)}

				{question.type === "SHORT_ANSWER" && (
					<div>
						<textarea
							value={answer || ""}
							onChange={(e) => onAnswer(e.target.value)}
							placeholder="Nhập câu trả lời của bạn..."
							className="w-full p-3 md:p-4 rounded-xl border-2 border-gray-200 focus:border-purple-600 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none min-h-[100px] md:min-h-[120px] text-gray-900 resize-none font-medium text-sm md:text-base"
						/>
					</div>
				)}
			</div>
		</div>
	);
}
