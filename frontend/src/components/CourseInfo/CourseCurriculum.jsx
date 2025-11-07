import React from "react";
import { Video, FileText } from "lucide-react";

const lessonIcon = {
	VIDEO: <Video className="w-4 h-4 text-purple-600" />,
	TEXT: <FileText className="w-4 h-4 text-blue-600" />,
};

export default function CourseCurriculum({ modules }) {
	return (
		<>
			<h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">
				Curriculum
			</h2>
			<div className="space-y-6">
				{modules?.map((module, index) => (
					<div key={module.id}>
						<h3 className="text-lg font-semibold text-gray-800 mb-3">
							Module {index + 1}: {module.title}
						</h3>
						<ul className="space-y-2 pl-4 border-l-2 border-gray-200">
							{module.lessons?.map((lesson) => (
								<li
									key={lesson.id}
									className="flex items-center gap-3">
									{lessonIcon[lesson.type]}
									<span className="text-gray-700">
										{lesson.title}
									</span>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</>
	);
}
