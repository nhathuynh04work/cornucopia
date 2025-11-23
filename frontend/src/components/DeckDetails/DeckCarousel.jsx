import { useState, useEffect } from "react";
import {
	ChevronLeft,
	ChevronRight,
	RotateCcw,
	Maximize2,
	RotateCw,
} from "lucide-react";
import CarouselCard from "./CarouselCard";

function DeckCarousel({ cards = [] }) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [direction, setDirection] = useState("next"); // 'next' | 'prev'

	const handleNext = () => {
		if (currentIndex < cards.length - 1) {
			setDirection("next");
			setCurrentIndex((prev) => prev + 1);
		}
	};

	const handlePrev = () => {
		if (currentIndex > 0) {
			setDirection("prev");
			setCurrentIndex((prev) => prev - 1);
		}
	};

	const handleRestart = () => {
		setDirection("prev");
		setCurrentIndex(0);
	};

	// Keyboard navigation
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "ArrowRight") handleNext();
			if (e.key === "ArrowLeft") handlePrev();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [currentIndex, cards.length]);

	if (!cards.length) {
		return (
			<div className="w-full h-80 bg-white rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-gray-400 gap-3">
				<div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
					<RotateCw className="w-6 h-6 text-gray-300" />
				</div>
				<p>Bộ thẻ này chưa có thuật ngữ nào.</p>
			</div>
		);
	}

	const currentCard = cards[currentIndex];

	return (
		<div className="w-full mb-10 select-none">
			{/* CSS Animation Definitions */}
			<style>{`
                @keyframes slideInRight {
                    from { transform: translateX(50px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideInLeft {
                    from { transform: translateX(-50px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .animate-slide-right {
                    animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .animate-slide-left {
                    animation: slideInLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>

			<CarouselCard
				key={currentIndex}
				term={currentCard.term}
				definition={currentCard.definition}
				animationClass={
					direction === "next"
						? "animate-slide-right"
						: "animate-slide-left"
				}
			/>

			{/* Controls */}
			<div className="flex items-center justify-between mt-8 px-2">
				<div className="flex items-center gap-4">
					<button
						onClick={handleRestart}
						className="p-3 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
						title="Học lại từ đầu">
						<RotateCcw className="w-5 h-5" />
					</button>
				</div>

				<div className="flex items-center gap-6">
					<button
						onClick={handlePrev}
						disabled={currentIndex === 0}
						className="w-14 h-14 flex items-center justify-center rounded-full border-2 border-gray-200 text-gray-400 hover:text-purple-600 hover:bg-purple-50 disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-all">
						<ChevronLeft className="w-8 h-8" />
					</button>

					<span className="text-lg font-bold text-gray-700 tabular-nums min-w-[3rem] text-center">
						{currentIndex + 1} / {cards.length}
					</span>

					<button
						onClick={handleNext}
						disabled={currentIndex === cards.length - 1}
						className="w-14 h-14 flex items-center justify-center rounded-full border-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-all">
						<ChevronRight className="w-8 h-8" />
					</button>
				</div>

				<div className="flex items-center gap-4">
					<button
						className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
						title="Toàn màn hình">
						<Maximize2 className="w-5 h-5" />
					</button>
				</div>
			</div>
		</div>
	);
}

export default DeckCarousel;
