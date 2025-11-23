import { X } from "lucide-react";
import { Link } from "react-router-dom";

function StudyHeader({ title, current, total, deckId }) {
	const progress = Math.round(((current + 1) / total) * 100);

	return (
		<div className="h-16 px-6 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-40">
			{/* Progress Section */}
			<div className="flex items-center gap-4 flex-1">
				<span className="font-bold text-gray-900 text-lg truncate max-w-[200px] md:max-w-md">
					{title}
				</span>
				<div className="flex items-center gap-3 flex-1 max-w-xs">
					<span className="text-sm font-medium text-gray-500 whitespace-nowrap">
						{current + 1} / {total}
					</span>
					<div className="h-2 bg-gray-100 rounded-full flex-1 overflow-hidden">
						<div
							className="h-full bg-purple-500 transition-all duration-300 ease-out"
							style={{ width: `${progress}%` }}
						/>
					</div>
				</div>
			</div>

			{/* Close Button */}
			<Link
				to={`/decks/${deckId}`}
				className="p-2 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-full transition-colors"
				title="Thoát phiên học">
				<X className="w-6 h-6" />
			</Link>
		</div>
	);
}

export default StudyHeader;
