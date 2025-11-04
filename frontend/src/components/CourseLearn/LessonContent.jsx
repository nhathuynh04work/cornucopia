import React from "react";

function LessonContent({ activeLesson }) {
	return (
		<div className="bg-white shadow-sm h-[60vh] border-b">
			{activeLesson.type === "VIDEO" && (
				<div className="w-full h-full bg-black">
					<video
						key={activeLesson.videoUrl}
						className="w-full h-full"
						src={activeLesson.videoUrl}
						controls
						autoPlay>
						Your browser does not support the video tag.
					</video>
				</div>
			)}

			{activeLesson.type === "TEXT" && (
				<div className="w-full h-full overflow-y-auto p-6 md:p-10">
					<p className="text-gray-700 leading-relaxed">
						{activeLesson.content ||
							"This is the text content for the lesson."}
					</p>
				</div>
			)}
		</div>
	);
}

export default LessonContent;
