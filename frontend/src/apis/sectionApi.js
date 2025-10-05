import { api } from "./axios.js";

export async function addSection(testId) {
	const { data } = await api.post("/sections", {
		testId,
	});
	return data.section;
}

export async function deleteSection(sectionId) {
	await api.delete(`/sections/${sectionId}`);
}
