import { create } from "zustand";

export const useCourseEditorStore = create((set, get) => ({
	// STATE
	course: null,

	// ACTIONS
	setCourse: (data) => {
		set({ course: data });
	},

	changeCoverUrl: (url) => {
		const currentCourse = get().course;
		set({ course: { ...currentCourse, coverUrl: url } });
	},

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
		if (currentCourse) {
			set({
				course: {
					...currentCourse,
					modules: currentCourse.modules.filter(
						(m) => m.id !== moduleId
					),
				},
			});
		}
	},
}));
