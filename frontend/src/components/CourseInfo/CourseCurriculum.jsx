import React, { useState } from "react";
import {
	Video,
	FileText,
	ChevronDown,
	ChevronRight,
	Clock,
} from "lucide-react";

const lessonIcon = {
	VIDEO: <Video className="w-4 h-4 text-purple-600" />,
	TEXT: <FileText className="w-4 h-4 text-blue-600" />,
};

export default function CourseCurriculum({ modules }) {
	const [openModules, setOpenModules] = useState({});

	const toggleModule = (id) => {
		setOpenModules((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	return (
		<section>
			<h2 className="text-2xl font-bold text-gray-900 mb-6">
				Curriculum
			</h2>

			<div className="space-y-4">
				{modules?.map((module, index) => {
					const isOpen = openModules[module.id];
					const lessonCount = module.lessons?.length || 0;

					return (
						<div
							key={module.id}
							className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden transition-colors hover:border-purple-300">
							{/* Module Header */}
							<button
								onClick={() => toggleModule(module.id)}
								className="flex w-full items-center justify-between px-5 py-4 text-left focus:outline-none">
								<div className="flex items-center gap-2">
									{isOpen ? (
										<ChevronDown className="w-4 h-4 text-gray-500" />
									) : (
										<ChevronRight className="w-4 h-4 text-gray-500" />
									)}
									<h3 className="text-lg font-semibold text-gray-900">
										Module {index + 1}: {module.title}
									</h3>
								</div>

								<span className="text-sm font-medium text-gray-600">
									{lessonCount}{" "}
									{lessonCount === 1 ? "Lesson" : "Lessons"}
								</span>
							</button>

							{/* Lesson List */}
							{isOpen && (
								<ul className="px-6 py-5 space-y-3 border-t border-gray-100 transition-all">
									{module.lessons?.map((lesson) => (
										<li
											key={lesson.id}
											className="flex items-center justify-between gap-3 text-gray-700">
											<div className="flex items-center gap-3">
												{lessonIcon[lesson.type]}
												<span>{lesson.title}</span>
											</div>
											{lesson.duration && (
												<div className="flex items-center gap-1 text-xs text-gray-500">
													<Clock className="w-3.5 h-3.5" />
													{lesson.duration}
												</div>
											)}
										</li>
									))}
								</ul>
							)}
						</div>
					);
				})}
			</div>
		</section>
	);
}
