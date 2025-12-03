import { Menu, ArrowLeft } from "lucide-react";
import AudioPlayer from "./AudioPlayer";
import Timer from "./Timer";

export default function TestHeader({
	title,
	currentIdx,
	totalQuestions,
	audioUrl,
	progress,
	timeLimit,
	onTogglePalette,
	onSubmit,
	onExit,
}) {
	return (
		<header className="flex-none bg-white border-b border-gray-200 shadow-sm z-40">
			<div className="max-w-[1800px] mx-auto px-4 h-16 flex items-center justify-between gap-3 md:gap-4">
				{/* Left Section: Exit & Menu & Title */}
				<div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1 sm:flex-none">
					{/* Exit Button */}
					<button
						onClick={onExit}
						className="p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-xl transition-colors flex-shrink-0"
						title="Thoát bài thi">
						<ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
					</button>

					<div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block flex-shrink-0" />

					{/* Mobile Menu Trigger */}
					<button
						onClick={onTogglePalette}
						className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600 flex-shrink-0">
						<Menu className="w-5 h-5 md:w-6 md:h-6" />
					</button>

					{/* Title Section */}
					<div className="min-w-0 flex-1">
						<h1 className="text-sm md:text-base font-bold text-gray-900 truncate block">
							{title}
						</h1>
						<p className="text-xs text-gray-500 sm:hidden">
							{currentIdx + 1}/{totalQuestions}
						</p>
						<p className="hidden sm:block text-xs text-gray-500">
							Câu {currentIdx + 1} / {totalQuestions}
						</p>
					</div>
				</div>

				{/* Center Section: Audio (Desktop) */}
				{audioUrl && (
					<div className="hidden md:flex flex-1 justify-center mx-4">
						<AudioPlayer src={audioUrl} />
					</div>
				)}

				{/* Right Section: Timer & Submit */}
				<div className="flex items-center gap-2 md:gap-6 flex-shrink-0">
					<div className="hidden lg:block text-right">
						<div className="text-xs font-bold text-gray-500 mb-1">
							Tiến độ: {progress}%
						</div>
						<div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
							<div
								className="h-full bg-purple-600 transition-all duration-500"
								style={{ width: `${progress}%` }}
							/>
						</div>
					</div>

					<div className="h-8 w-px bg-gray-200 hidden lg:block" />

					<Timer seconds={timeLimit} />

					<button
						onClick={onSubmit}
						className="hidden sm:block px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm">
						Nộp bài
					</button>
				</div>
			</div>
		</header>
	);
}
