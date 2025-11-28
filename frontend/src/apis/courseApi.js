import { api } from "./axios";

const courseApi = {
	getAll: async (params) => {
		const { data } = await api.get("/courses", { params });
		return data.courses;
	},
	getForInfoView: async (courseId) => {
		const { data } = await api.get(`/courses/${courseId}/info`);
		return data.course;
	},
	getEnrollmentStatus: async (courseId) => {
		const { data } = await api.get(`/courses/${courseId}/enrollment`);
		return data.enrollment;
	},
	getForEditor: async (courseId) => {
		const { data } = await api.get(`/courses/${courseId}/edit`);
		return data.course;
	},
	getForLearning: async (courseId) => {
		const { data } = await api.get(`/courses/${courseId}/learn`);
		return data.course;
	},
	getEnrolled: async () => {
		const { data } = await api.get("/courses/enrolled");
		return data.courses;
	},
	createCourse: async (payload) => {
		const { data } = await api.post("/courses", payload);
		return data.course;
	},
	updateCourse: async (id, payload) => {
		const { data } = await api.patch(`/courses/${id}`, payload);
		return data.course;
	},
	deleteCourse: async (id) => {
		await api.delete(`/courses/${id}`);
	},

	// --- MODULES ---
	addModule: async (courseId, payload) => {
		const { data } = await api.post(
			`/courses/${courseId}/modules`,
			payload
		);
		return data.module;
	},
	updateModule: async (moduleId, courseId, payload) => {
		const { data } = await api.patch(
			`/courses/${courseId}/modules/${moduleId}`,
			payload
		);
		return data.module;
	},
	deleteModule: async (moduleId, courseId) => {
		await api.delete(`/courses/${courseId}/modules/${moduleId}`);
	},

	// --- LESSONS ---
	addLesson: async (moduleId, courseId, payload) => {
		const { data } = await api.post(
			`/courses/${courseId}/modules/${moduleId}/lessons`,
			payload
		);
		return data.lesson;
	},
	updateLesson: async (lessonId, moduleId, courseId, payload) => {
		const { data } = await api.patch(
			`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
			payload
		);
		return data.lesson;
	},
	deleteLesson: async (lessonId, moduleId, courseId) => {
		await api.delete(
			`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`
		);
	},

	updateLessonProgress: async (courseId, moduleId, lessonId, isCompleted) => {
		console.log(courseId, moduleId, lessonId);
		const { data } = await api.put(
			`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/progress`,
			{ isCompleted }
		);
		return data.progress;
	},

	createCheckoutSession: async (courseId) => {
		const { data } = await api.post(`/checkout/create-session/${courseId}`);
		return data.url;
	},
};

export default courseApi;
