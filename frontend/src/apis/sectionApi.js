import { api } from "./axios.js";

export async function create(testId) {
	const { data } = await api.post(`/tests/${testId}/sections`);
	return data.section;
}

export async function remove(sectionId) {
	await api.delete(`/sections/${sectionId}`);
}

export async function addItem(sectionId, input) {
	const { data } = await api.post(`/sections/${sectionId}/items`, input);
	return data.section;
}
