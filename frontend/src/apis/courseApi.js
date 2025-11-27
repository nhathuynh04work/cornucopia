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
	createCheckoutSession: async (courseId) => {
		const { data } = await api.post(`/checkout/create-session/${courseId}`);
		return data.url;
	},
};

export default courseApi;
