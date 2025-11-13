export default function CourseProgressCard({ course, onResume }) {
	const { title, creator, progress, nextLesson, id } = course;

	// Calculate progress percentage, handling division by zero
	const progressPercent =
		progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;

	return (
		<div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col justify-between">
			<div>
				<h3 className="text-lg font-semibold text-gray-800">{title}</h3>
				<p className="text-sm text-gray-600 mb-2">{creator}</p>
				<div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
					<div
						className="bg-purple-600 h-2.5 rounded-full"
						style={{
							width: `${progressPercent}%`,
						}}></div>
				</div>
				<p className="text-xs text-gray-500 mb-4">
					{progress.completed} / {progress.total} lessons completed
				</p>
			</div>
			<button
				onClick={() => onResume(id, nextLesson)}
				disabled={nextLesson === "Course Completed"}
				className={`mt-auto text-white py-2 px-4 rounded text-sm ${
					nextLesson === "Course Completed"
						? "bg-gray-400 cursor-not-allowed"
						: "bg-purple-600 hover:bg-purple-700"
				}`}>
				{nextLesson === "Course Completed"
					? "Completed"
					: `Resume: ${nextLesson}`}
			</button>
		</div>
	);
}
