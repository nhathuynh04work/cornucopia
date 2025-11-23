import { api } from "./axios";

const lessonApi = {
	update: async (lessonId, payload) => {
		const { data } = await api.patch(`/lessons/${lessonId}`, payload);
		return data.lesson;
	},
	toggleComplete: async ({ lessonId, isCompleted }) => {
		const { data } = await api.post(`/lessons/${lessonId}/progress`, {
			isCompleted,
		});
		return data.progress;
	},
};

export default lessonApi;
