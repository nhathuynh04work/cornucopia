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
}));
