import { useState, useEffect } from "react";
import { RotateCw, Volume2 } from "lucide-react";

function StudyCard({ card, onFlip }) {
	const [isFlipped, setIsFlipped] = useState(false);

	const handleFlip = () => {
		const newState = !isFlipped;
		setIsFlipped(newState);
		if (onFlip) onFlip(newState);
	};

	const handleSpeak = (text, e) => {
		e.stopPropagation();
		window.speechSynthesis.cancel();
		const utterance = new SpeechSynthesisUtterance(text);
		window.speechSynthesis.speak(utterance);
	};

	// Keyboard shortcut: Space to flip
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.code === "Space") {
				e.preventDefault();
				handleFlip();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isFlipped]);

	return (
		<div
			className="w-full max-w-3xl mx-auto h-[60vh] perspective-1000 cursor-pointer group select-none"
			onClick={handleFlip}>
			<div
				className="relative w-full h-full transition-all duration-500 rounded-3xl bg-white border border-gray-200"
				style={{
					transformStyle: "preserve-3d",
					transform: isFlipped ? "rotateX(180deg)" : "rotateX(0deg)",
				}}>
				{/* Front (Term) */}
				<div
					className="absolute inset-0 flex flex-col items-center justify-center p-12 backface-hidden rounded-3xl bg-white"
					style={{ backfaceVisibility: "hidden" }}>
					{/* Audio Button (Top Right) */}
					<button
						onClick={(e) => handleSpeak(card.term, e)}
						className="absolute top-6 right-6 p-3 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all z-10"
						title="Nghe phát âm">
						<Volume2 className="w-6 h-6" />
					</button>

					<span className="text-xs font-bold text-gray-400 uppercase tracking-widest absolute top-8 left-8">
						Thuật ngữ
					</span>
					<div className="text-3xl md:text-5xl font-bold text-gray-900 text-center leading-tight break-words overflow-y-auto max-h-full px-4 scrollbar-hide">
						{card.term}
					</div>
					<div className="absolute bottom-8 text-gray-400 text-sm font-medium flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
						<RotateCw className="w-4 h-4" />
						Nhấn hoặc phím Space để lật
					</div>
				</div>

				{/* Back (Definition) */}
				<div
					className="absolute inset-0 flex flex-col items-center justify-center p-12 rounded-3xl bg-purple-50/50 backface-hidden"
					style={{
						backfaceVisibility: "hidden",
						transform: "rotateX(180deg)",
					}}>
					{/* Audio Button (Top Right) */}
					<button
						onClick={(e) => handleSpeak(card.definition, e)}
						className="absolute top-6 right-6 p-3 text-purple-400 hover:text-purple-700 hover:bg-purple-100 rounded-full transition-all z-10"
						title="Nghe phát âm">
						<Volume2 className="w-6 h-6" />
					</button>

					<span className="text-xs font-bold text-purple-400 uppercase tracking-widest absolute top-8 left-8">
						Định nghĩa
					</span>
					<div className="text-2xl md:text-4xl font-medium text-purple-900 text-center leading-relaxed break-words overflow-y-auto max-h-full px-4 scrollbar-hide">
						{card.definition}
					</div>
				</div>
			</div>
		</div>
	);
}

export default StudyCard;
