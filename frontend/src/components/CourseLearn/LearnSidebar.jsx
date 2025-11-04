import React from "react";
import ModuleHeader from "./ModuleHeader";
import LessonItem from "./LessonItem";

function LearnSidebar({
	course,
	activeLesson,
	openModules,
	toggleModule,
	setActiveLesson,
	lessonMap,
	headerHeight,
}) {
	return (
		<aside
			className="w-96 bg-white border-l border-gray-200 overflow-y-auto sticky"
			style={{
				top: `${headerHeight}px`,
				height: `calc(100vh - ${headerHeight}px)`,
			}}>
			<div>
				{course.modules?.map((module, index) => {
					// --- PLACEHOLDER DATA FOR MODULE HEADER ---
					const totalLessons = module.lessons?.length || 0;
					const checkedCount = Math.floor(totalLessons / 3);
					const totalTime = totalLessons * 5;
					const isOpen = !!openModules[module.id];

					return (
						<div
							key={module.id}
							className="border-b border-gray-300 last:border-b-0">
							{/* --- 1. Use ModuleHeader Component --- */}
							<ModuleHeader
								module={module}
								index={index}
								isOpen={isOpen}
								checkedCount={checkedCount}
								totalLessons={totalLessons}
								totalTime={totalTime}
								onClick={() => toggleModule(module.id)}
							/>

							{/* --- LESSONS LIST --- */}
							{isOpen && (
								<div>
									{module.lessons?.map((lesson) => {
										const lessonNumber = lessonMap.get(
											lesson.id
										);
										// Placeholder: every 3rd lesson is complete
										const isCompleted =
											lessonNumber % 3 === 0;
										const isActive =
											activeLesson?.id === lesson.id;

										return (
											// --- 2. Use LessonItem Component ---
											<LessonItem
												key={lesson.id}
												lesson={lesson}
												lessonNumber={lessonNumber}
												isCompleted={isCompleted}
												isActive={isActive}
												onSelectLesson={setActiveLesson}
											/>
										);
									})}
								</div>
							)}
						</div>
					);
				})}
			</div>
		</aside>
	);
}

export default LearnSidebar;
