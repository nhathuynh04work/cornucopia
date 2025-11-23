import { api } from "./axios";

const moduleApi = {
	addLesson: async (moduleId) => {
		const { data } = await api.post(`/modules/${moduleId}/lessons`);
		return data.lesson;
	},
	update: async (moduleId, payload) => {
		const { data } = await api.patch(`/modules/${moduleId}`, payload);
		return data.module;
	},
	remove: async (moduleId) => {
		await api.delete(`/modules/${moduleId}`);
	},
};

export default moduleApi;