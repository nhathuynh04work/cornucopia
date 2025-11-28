import {
	ChevronDown,
	PlayCircle,
	FileText,
	CheckSquare,
	Lock,
	Square,
	Loader2,
	X,
} from "lucide-react";

export default function CourseLearnSidebar({
	course,
	openModules,
	toggleModule,
	currentLessonId,
	handleLessonChange,
	handleToggleProgress,
	updateProgressMutation,
	isSidebarOpen,
	setIsSidebarOpen,
}) {
	return (
		<>
			<aside
				className={`
                    fixed inset-y-0 right-0 w-96 bg-white border-l border-gray-200 transform transition-transform duration-300 ease-in-out z-30
                    lg:relative lg:translate-x-0 flex flex-col shadow-xl lg:shadow-none
                    ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}
                `}>
				<div className="p-4 border-b border-gray-100 font-bold text-gray-900 flex justify-between items-center lg:hidden bg-gray-50">
					<span>Nội dung khóa học</span>
					<button onClick={() => setIsSidebarOpen(false)}>
						<X className="w-5 h-5 text-gray-500" />
					</button>
				</div>

				<div className="overflow-y-auto flex-1 scroll-container">
					{course.modules.map((module, idx) => {
						const isOpen = openModules[module.id];
						const completedCount = module.lessons.filter(
							(l) => l.isCompleted
						).length;
						const totalCount = module.lessons.length;
						const totalModuleDuration = module.lessons.reduce(
							(acc, l) => acc + (l.duration || 0),
							0
						);

						return (
							<div
								key={module.id}
								className="border-b border-gray-100">
								<button
									onClick={() => toggleModule(module.id)}
									className="w-full flex items-center justify-between p-4 hover:bg-gray-100 transition-colors text-left bg-gray-100">
									<div className="flex-1 pr-2">
										<div className="font-semibold text-gray-900 text-sm mb-1">
											Chương {idx + 1}: {module.title}
										</div>
										<div className="text-xs text-gray-500 font-medium flex items-center gap-2">
											<span className="text-gray-500">
												{completedCount}/{totalCount}
											</span>
											<span className="w-1 h-1 rounded-full bg-gray-400"></span>
											<span>
												{totalModuleDuration} phút
											</span>
										</div>
									</div>
									<ChevronDown
										className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${
											isOpen ? "rotate-180" : ""
										}`}
									/>
								</button>

								{isOpen && (
									<div className="bg-white animate-in slide-in-from-top-2 fade-in duration-300 origin-top">
										{module.lessons.map((lesson, lIdx) => {
											const isActive =
												currentLessonId === lesson.id;
											const Icon =
												lesson.type === "VIDEO"
													? PlayCircle
													: FileText;

											return (
												<button
													key={lesson.id}
													onClick={() =>
														!lesson.isLocked &&
														handleLessonChange(
															lesson.id
														)
													}
													className={`
                                                        w-full flex items-start gap-3 p-3 pl-6 transition-all text-left relative
                                                        ${
															isActive
																? "bg-purple-50"
																: "bg-white hover:bg-gray-50"
														}
                                                        ${
															lesson.isLocked
																? "opacity-60 cursor-not-allowed"
																: ""
														}
                                                    `}>
													<div
														className={`mt-0.5 shrink-0 cursor-pointer p-1 rounded hover:bg-gray-200 transition-colors ${
															isActive
																? "text-purple-600"
																: "text-gray-400"
														}`}
														onClick={(e) =>
															!lesson.isLocked &&
															handleToggleProgress(
																e,
																lesson
															)
														}>
														{updateProgressMutation.isPending &&
														updateProgressMutation
															.variables
															?.lessonId ===
															lesson.id ? (
															<Loader2 className="w-4 h-4 animate-spin" />
														) : lesson.isCompleted ? (
															<CheckSquare className="w-4 h-4 text-purple-600 fill-purple-100" />
														) : lesson.isLocked ? (
															<Lock className="w-4 h-4" />
														) : (
															<Square className="w-4 h-4 text-gray-300" />
														)}
													</div>

													<div className="flex-1 min-w-0">
														<div
															className={`text-sm font-medium truncate ${
																isActive
																	? "text-purple-900"
																	: "text-gray-700"
															}`}>
															{lIdx + 1}.{" "}
															{lesson.title}
														</div>
														<div className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
															<Icon className="w-3.5 h-3.5" />
															<span>
																{
																	lesson.duration
																}{" "}
																phút
															</span>
														</div>
													</div>
												</button>
											);
										})}
									</div>
								)}
							</div>
						);
					})}
				</div>
			</aside>

			{isSidebarOpen && (
				<div
					className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden"
					onClick={() => setIsSidebarOpen(false)}
				/>
			)}
		</>
	);
}
