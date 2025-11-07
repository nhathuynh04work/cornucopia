import { create } from "zustand";

export const useCourseEditorStore = create((set, get) => ({
	// STATE
	course: null,

	// COURSE ACTIONS
	setCourse: (data) => {
		set({ course: data });
	},

	getLessonIndex: (lessonId) => {
		const course = get().course;

		// flatten
		const allLessonIds = course.modules.flatMap((module) =>
			module.lessons.map((lesson) => lesson.id)
		);

		const index = allLessonIds.indexOf(lessonId);

		return index; // 0-based
	},
}));
