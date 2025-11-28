import { useState } from "react";
import { ChevronDown, Video, FileText, Lock, PlayCircle } from "lucide-react";

const lessonIcon = {
	VIDEO: <Video className="w-4 h-4" />,
	TEXT: <FileText className="w-4 h-4" />,
};

export default function CourseCurriculumList({ modules, isEnrolled }) {
	const [openModules, setOpenModules] = useState({});

	const toggleModule = (id) => {
		setOpenModules((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	if (!modules || modules.length === 0) {
		return (
			<div className="py-12 text-center">
				<p className="text-gray-400 text-sm">
					Khóa học này chưa có nội dung.
				</p>
			</div>
		);
	}

	return (
		<div className="bg-white w-full">
			{modules.map((module, idx) => {
				const isOpen = openModules[module.id];
				const lessonCount = module.lessons?.length || 0;

				return (
					<div
						key={module.id}
						className="border-b border-gray-100 last:border-0">
						{/* Module Header */}
						<button
							onClick={() => toggleModule(module.id)}
							className="w-full flex items-center justify-between py-4 pl-6 pr-4 hover:bg-gray-50 transition-colors text-left group">
							<div className="flex items-center gap-3">
								<div
									className={`text-gray-400 transition-transform duration-200 ${
										isOpen ? "rotate-180" : ""
									}`}>
									<ChevronDown className="w-5 h-5" />
								</div>
								<div>
									{/* UPDATED: font-bold -> font-semibold */}
									<h3 className="font-semibold text-gray-900 text-base leading-none">
										Chương {idx + 1}: {module.title}
									</h3>
									<p className="text-xs text-gray-500 mt-1 font-medium">
										{lessonCount} bài học
									</p>
								</div>
							</div>
						</button>

						{/* Lesson List */}
						{isOpen && (
							<div className="animate-in slide-in-from-top-2 fade-in duration-300 origin-top">
								<div className="divide-y divide-gray-100/60 border-t border-gray-100/60">
									{module.lessons?.map((lesson, lIdx) => (
										<div
											key={lesson.id}
											// UPDATED: items-start for multiline, adjusted padding
											className={`flex items-start justify-between py-3 pl-12 pr-6 transition-all group/lesson ${
												isEnrolled
													? "hover:bg-gray-50 cursor-pointer text-gray-700 hover:text-purple-700"
													: "opacity-60 cursor-not-allowed text-gray-500"
											}`}>
											<div className="flex items-start gap-3 min-w-0">
												{/* Icon */}
												<div
													className={`shrink-0 mt-0.5 ${
														lesson.type === "VIDEO"
															? "text-purple-500"
															: "text-blue-500"
													}`}>
													{lessonIcon[lesson.type]}
												</div>

												{/* UPDATED: Title & Duration Stack */}
												<div className="flex flex-col gap-0.5">
													<span className="text-sm font-medium truncate">
														Bài {lIdx + 1}:{" "}
														{lesson.title}
													</span>
													<span className="text-xs text-gray-400">
														{lesson.duration} phút
													</span>
												</div>
											</div>

											<div className="flex items-center gap-4 shrink-0 mt-1">
												{isEnrolled ? (
													<PlayCircle className="w-4 h-4 text-gray-300 group-hover/lesson:text-purple-500 transition-colors" />
												) : (
													<Lock className="w-3.5 h-3.5 text-gray-300" />
												)}
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}
