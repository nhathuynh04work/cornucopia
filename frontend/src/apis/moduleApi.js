import { api } from "./axios";

export async function addLesson(moduleId) {
	const { data } = await api.post(`/modules/${moduleId}/lessons`);
	return data.lesson;
}

export async function update(moduleId, payload) {
	const { data } = await api.patch(`/modules/${moduleId}`, payload);
	return data.module;
}

export async function remove(moduleId) {
	await api.delete(`/modules/${moduleId}`);
}
