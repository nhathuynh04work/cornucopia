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
					// --- 1. Calculate Real Data from Backend ---
					const totalLessons = module.lessons?.length || 0;

					// Count completed lessons from the 'progress' array
					const checkedCount = module.lessons.filter(
						(l) => l.progress?.[0]?.isCompleted
					).length;

					// Sum duration (in seconds) from all lessons
					const totalSeconds = module.lessons.reduce(
						(acc, l) => acc + (l.duration || 0),
						0
					);
					// Convert to minutes
					const totalTime = Math.round(totalSeconds / 60);

					const isOpen = !!openModules[module.id];

					return (
						<div
							key={module.id}
							className="border-b border-gray-300 last:border-b-0">
							{/* --- 2. Pass Real Data to ModuleHeader --- */}
							<ModuleHeader
								module={module}
								index={index}
								isOpen={isOpen}
								checkedCount={checkedCount}
								totalLessons={totalLessons}
								totalTime={totalTime} // Pass total minutes
								onClick={() => toggleModule(module.id)}
							/>

							{/* --- LESSONS LIST --- */}
							{isOpen && (
								<div>
									{module.lessons?.map((lesson) => {
										const lessonNumber = lessonMap.get(
											lesson.id
										);

										// 3. Get Real Completion Status
										const isCompleted =
											lesson.progress?.[0]?.isCompleted ??
											false;

										const isActive =
											activeLesson?.id === lesson.id;

										return (
											<LessonItem
												key={lesson.id}
												courseId={course.id} // 4. Pass courseId for mutation
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
