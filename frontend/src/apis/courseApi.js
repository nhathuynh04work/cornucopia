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
	create: async (payload) => {
		const { data } = await api.post("/courses", payload);
		return data.course;
	},
	update: async (courseId, payload) => {
		const { data } = await api.patch(`/courses/${courseId}`, payload);
		return data.course;
	},
	remove: async (courseId) => {
		await api.delete(`/courses/${courseId}`);
	},
	addModule: async (courseId) => {
		const { data } = await api.post(`/courses/${courseId}/modules`);
		return data.module;
	},
	createCheckoutSession: async (courseId) => {
		const { data } = await api.post(`/checkout/create-session/${courseId}`);
		return data.url;
	},
};

export default courseApi;