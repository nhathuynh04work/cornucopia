import { api } from "./axios";

export async function update(lessonId, payload) {
	const { data } = await api.patch(`/lessons/${lessonId}`, payload);
	return data.lesson;
}

export async function toggleLessonComplete({ lessonId, isCompleted }) {
	const { data } = await api.post(`/lessons/${lessonId}/progress`, {
		isCompleted,
	});
	return data.progress;
}
