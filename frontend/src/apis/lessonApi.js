import { api } from "./axios";

export async function update(lessonId, payload) {
	const { data } = await api.patch(`/lessons/${lessonId}`, payload);
	return data.lesson;
}
