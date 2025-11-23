export function MultipleChoiceFeedback({ options, submittedIds, correctIds }) {
	return (
		<div className="flex flex-col gap-2">
			{options.map((option) => {
				const isSelected = submittedIds.includes(option.id);
				const isCorrect = correctIds.includes(option.id);

				let className =
					"flex items-center justify-between p-2 rounded border text-gray-600 border-gray-200";
				if (isCorrect)
					className =
						"flex items-center justify-between p-2 rounded border bg-green-50 border-green-200 text-green-800 font-medium";
				else if (isSelected)
					className =
						"flex items-center justify-between p-2 rounded border bg-red-50 border-red-200 text-red-800";

				return (
					<div key={option.id} className={className}>
						<span className="flex items-center gap-2">
							<div
								className={`w-4 h-4 rounded-full border flex items-center justify-center ${
									isSelected || isCorrect
										? "border-current"
										: "border-gray-300"
								}`}>
								{(isSelected || isCorrect) && (
									<div className="w-2 h-2 rounded-full bg-current" />
								)}
							</div>
							{option.text}
						</span>

						{isCorrect && (
							<span className="text-[10px] font-bold uppercase bg-green-200 text-green-800 px-1.5 py-0.5 rounded">
								Đúng
							</span>
						)}
						{!isCorrect && isSelected && (
							<span className="text-[10px] font-bold uppercase bg-red-200 text-red-800 px-1.5 py-0.5 rounded">
								Chọn
							</span>
						)}
					</div>
				);
			})}
		</div>
	);
}

export function ShortAnswerFeedback({ submittedText, correctText, isCorrect }) {
	return (
		<div className="grid grid-cols-1 gap-2">
			<div className="flex justify-between items-center border-b border-gray-100 pb-2">
				<span className="text-gray-500 text-xs uppercase">
					Bạn trả lời:
				</span>
				<span
					className={`font-medium ${
						isCorrect ? "text-green-700" : "text-red-600"
					}`}>
					{submittedText || "(Bỏ trống)"}
				</span>
			</div>
			{!isCorrect && (
				<div className="flex justify-between items-center">
					<span className="text-gray-500 text-xs uppercase">
						Đáp án đúng:
					</span>
					<span className="font-medium text-green-700">
						{correctText}
					</span>
				</div>
			)}
		</div>
	);
}
