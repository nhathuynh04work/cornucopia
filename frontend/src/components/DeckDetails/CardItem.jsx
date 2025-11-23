import { Volume2 } from "lucide-react";

function CardItem({ card }) {
	const handleSpeak = (text, e) => {
		e.stopPropagation();
		window.speechSynthesis.cancel();
		const utterance = new SpeechSynthesisUtterance(text);
		window.speechSynthesis.speak(utterance);
	};

	return (
		<div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 hover:border-purple-200 transition-all flex flex-col md:flex-row md:items-start gap-4 md:gap-8 group">
			{/* Term */}
			<div className="md:w-1/3 border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-8 flex justify-between items-start">
				<div>
					<span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2 md:hidden">
						Thuật ngữ
					</span>
					<p className="text-lg text-gray-900 font-medium leading-relaxed break-words">
						{card.term}
					</p>
				</div>

				<button
					onClick={(e) => handleSpeak(card.term, e)}
					className="md:hidden p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all">
					<Volume2 className="w-5 h-5" />
				</button>
			</div>

			{/* Definition */}
			<div className="md:w-2/3 flex justify-between items-start">
				<div>
					<span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2 md:hidden">
						Định nghĩa
					</span>
					<p className="text-lg text-gray-600 leading-relaxed break-words">
						{card.definition}
					</p>
				</div>

				{/* Audio Button - Always Visible */}
				<button
					onClick={(e) => handleSpeak(card.term, e)}
					className="hidden md:flex p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all"
					title="Nghe phát âm">
					<Volume2 className="w-5 h-5" />
				</button>
			</div>
		</div>
	);
}

export default CardItem;
