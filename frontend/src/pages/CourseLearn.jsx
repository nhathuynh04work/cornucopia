import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useCourseLearnQuery } from "@/hooks/useCourseQuery"; // This hook is correct
import LearnHeader from "@/components/CourseLearn/LearnHeader";
import LearnSidebar from "@/components/CourseLearn/LearnSidebar";
import LessonContent from "@/components/CourseLearn/LessonContent";
import LearnTabs from "@/components/CourseLearn/LearnTabs";

function CourseLearn() {
	const { id } = useParams();
	const { data: course, isPending } = useCourseLearnQuery(id);

	const [activeLesson, setActiveLesson] = useState(null);
	const [openModules, setOpenModules] = useState({});
	const [activeTab, setActiveTab] = useState("overview");

	// --- 1. Calculate Real Progress ---
	const { progressPercent } = useMemo(() => {
		let total = 0;
		let completed = 0;

		course?.modules?.forEach((module) => {
			module.lessons?.forEach((lesson) => {
				total++;
				// Check if the progress array exists and isCompleted is true
				if (lesson.progress?.[0]?.isCompleted) {
					completed++;
				}
			});
		});

		const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
		return {
			totalLessons: total,
			completedLessons: completed,
			progressPercent: percent,
		};
	}, [course]);

	// CREATE A MAP FOR GLOBAL LESSON NUMBERS
	const lessonMap = useMemo(() => {
		const map = new Map();
		let counter = 1;
		course?.modules?.forEach((module) => {
			module.lessons?.forEach((lesson) => {
				map.set(lesson.id, counter);
				counter++;
			});
		});
		return map;
	}, [course]);

	useEffect(() => {
		if (course && course.modules?.[0]?.lessons?.[0]) {
			setActiveLesson(course.modules[0].lessons[0]);
			setOpenModules({ [course.modules[0].id]: true });
		}
	}, [course]);

	if (isPending) {
		return (
			<div className="flex items-center justify-center h-screen">
				<p className="p-6">Loading course...</p>
			</div>
		);
	}

	if (!course) {
		return (
			<div className="flex items-center justify-center h-screen">
				<p className="p-6">Course not found.</p>
			</div>
		);
	}

	const toggleModule = (moduleId) => {
		setOpenModules((prev) => ({
			...prev,
			[moduleId]: !prev[moduleId],
		}));
	};

	const HEADER_HEIGHT_PX = 64; // Corresponds to h-16 in LearnHeader

	return (
		<div>
			{/* --- 2. Pass Real Progress to Header --- */}
			<LearnHeader courseName={course.name} progress={progressPercent} />
			<div className="flex">
				{/* Column 1: Main Content (Lesson Viewer & Tabs) */}
				<main className="flex-1 bg-gray-100 min-h-screen pb-20">
					{activeLesson ? (
						<div>
							<LessonContent activeLesson={activeLesson} />
							<LearnTabs
								activeTab={activeTab}
								setActiveTab={setActiveTab}
								description={course.description}
							/>
						</div>
					) : (
						<div
							className="flex items-center justify-center p-10"
							style={{
								height: `calc(100vh - ${HEADER_HEIGHT_PX}px)`,
							}}>
							<p className="text-gray-500 text-lg">
								Select a lesson from the curriculum to begin.
							</p>
						</div>
					)}
				</main>

				{/* Column 2: Sticky Sidebar (Curriculum) */}
				<LearnSidebar
					course={course}
					activeLesson={activeLesson}
					openModules={openModules}
					toggleModule={toggleModule}
					setActiveLesson={setActiveLesson}
					lessonMap={lessonMap}
					headerHeight={HEADER_HEIGHT_PX}
				/>
			</div>
		</div>
	);
}

export default CourseLearn;
