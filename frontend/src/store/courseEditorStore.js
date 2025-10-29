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
}));
