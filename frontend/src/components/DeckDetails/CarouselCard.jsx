import { useState } from "react";
import { RotateCw } from "lucide-react";

function CarouselCard({ term, definition, animationClass }) {
	const [isFlipped, setIsFlipped] = useState(false);

	const handleCardClick = () => {
		setIsFlipped(!isFlipped);
	};

	return (
		<div
			className={`relative w-full h-[24rem] perspective-1000 cursor-pointer group select-none ${animationClass}`}
			onClick={handleCardClick}>
			<div
				className="relative w-full h-full rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-500"
				style={{
					transformStyle: "preserve-3d",
					transform: isFlipped ? "rotateX(180deg)" : "rotateX(0deg)",
				}}>
				{/* Front (Term) */}
				<div
					className="absolute inset-0 flex flex-col items-center justify-center p-8 md:p-12 bg-white rounded-3xl"
					style={{ backfaceVisibility: "hidden" }}>
					<span className="text-sm font-bold text-gray-400 uppercase tracking-widest absolute top-8 left-8">
						Thuật ngữ
					</span>
					<div className="text-2xl md:text-3xl font-medium text-gray-900 text-center leading-tight break-words max-w-full overflow-y-auto max-h-full px-2">
						{term}
					</div>
					<div className="absolute bottom-6 text-gray-400 text-sm font-medium flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
						<RotateCw className="w-4 h-4" />
						Nhấn để lật
					</div>
				</div>

				{/* Back (Definition) */}
				<div
					className="absolute inset-0 flex flex-col items-center justify-center p-8 md:p-12 rounded-3xl bg-purple-50/50"
					style={{
						backfaceVisibility: "hidden",
						transform: "rotateX(180deg)",
					}}>
					<span className="text-sm font-bold text-purple-400 uppercase tracking-widest absolute top-8 left-8">
						Định nghĩa
					</span>
					<div className="text-xl md:text-2xl font-medium text-purple-900 text-center leading-relaxed break-words max-w-full overflow-y-auto max-h-full px-2">
						{definition}
					</div>
				</div>
			</div>
		</div>
	);
}

export default CarouselCard;
