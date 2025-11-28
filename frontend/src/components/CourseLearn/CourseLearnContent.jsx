import { ChevronLeft, ChevronRight, FileText } from "lucide-react";

export default function CourseLearnContent({
	currentLesson,
	currentLessonIndex,
	totalLessons,
	handlePrev,
	handleNext,
}) {
	return (
		<div className="w-full relative mx-auto border-b border-gray-100 bg-gray-50">
			<div className="w-full h-[400px] md:h-[500px] relative group bg-black">
				{/* Prev Button */}
				<div className="absolute inset-y-0 left-4 flex items-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
					<button
						onClick={(e) => {
							e.stopPropagation();
							handlePrev();
						}}
						disabled={currentLessonIndex === 0}
						className="p-2 bg-purple-600/90 hover:bg-purple-700 text-white rounded-full shadow-lg backdrop-blur-sm disabled:opacity-0 pointer-events-auto transform hover:scale-110 transition-all border border-white/20"
						title="Bài trước">
						<ChevronLeft className="w-5 h-5" />
					</button>
				</div>

				{/* Next Button */}
				<div className="absolute inset-y-0 right-4 flex items-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
					<button
						onClick={(e) => {
							e.stopPropagation();
							handleNext();
						}}
						disabled={currentLessonIndex === totalLessons - 1}
						className="p-2 bg-purple-600/90 hover:bg-purple-700 text-white rounded-full shadow-lg backdrop-blur-sm disabled:opacity-0 pointer-events-auto transform hover:scale-110 transition-all border border-white/20"
						title="Bài tiếp theo">
						<ChevronRight className="w-5 h-5" />
					</button>
				</div>

				{/* Content */}
				{currentLesson?.type === "VIDEO" ? (
					<iframe
						src={currentLesson.videoUrl}
						className="w-full h-full"
						title="Lesson Video"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
					/>
				) : currentLesson?.htmlContent ? (
					<div className="h-full w-full overflow-y-auto p-4 md:p-12 bg-white">
						<div className="max-w-4xl mx-auto">
							<div className="mb-6">
								<h2 className="text-3xl font-bold text-gray-900 mb-2">
									{currentLesson.title}
								</h2>
							</div>
							<div
								className="prose prose-lg prose-gray max-w-none prose-headings:font-bold prose-a:text-purple-600 prose-img:rounded-xl"
								dangerouslySetInnerHTML={{
									__html: currentLesson.htmlContent,
								}}
							/>
						</div>
					</div>
				) : (
					<div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
						<FileText className="w-16 h-16 mb-4 text-purple-200" />
						<p className="font-medium text-gray-500">
							Bài học dạng văn bản
						</p>
						<p className="text-sm mt-2 text-gray-400">
							Nội dung đang được cập nhật
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
