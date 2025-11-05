import { create } from "zustand";

export const useCourseEditorStore = create((set, get) => ({
	// STATE
	course: null,

	// COURSE ACTIONS
	setCourse: (data) => {
		set({ course: data });
	},

	changeCoverUrl: (url) => {
		const currentCourse = get().course;
		set({ course: { ...currentCourse, coverUrl: url } });
	},

	// MODULE ACTIONS
	addModule: (module) => {
		const currentCourse = get().course;

		set({
			course: {
				...currentCourse,
				modules: [...currentCourse.modules, module],
			},
		});
	},

	removeModule: (moduleId) => {
		const currentCourse = get().course;
		set({
			course: {
				...currentCourse,
				modules: currentCourse.modules.filter((m) => m.id !== moduleId),
			},
		});
	},

	updateModule: (module) => {
		const currentCourse = get().course;
		set({
			course: {
				...currentCourse,
				modules: currentCourse.modules.map((m) =>
					m.id !== module.id ? m : module
				),
			},
		});
	},

	// LESSON ACTIONS
	addLesson: (newLesson) => {
		const currentCourse = get().course;
		const updatedModules = currentCourse.modules.map((module) => {
			if (module.id === newLesson.moduleId)
				return { ...module, lessons: [...module.lessons, newLesson] };

			return module;
		});

		set({ course: { ...currentCourse, modules: updatedModules } });
	},

	updateLesson: (updatedLesson) => {
		const currentCourse = get().course;
		if (!currentCourse) return;

		const updatedModules = currentCourse.modules.map((module) => {
			// Find the correct module
			if (module.id === updatedLesson.moduleId) {
				// Return a new module object with the updated lessons array
				return {
					...module,
					lessons: module.lessons.map((lesson) =>
						lesson.id === updatedLesson.id ? updatedLesson : lesson
					),
				};
			}
			// Not the module we're looking for, return it unchanged
			return module;
		});

		set({ course: { ...currentCourse, modules: updatedModules } });
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
