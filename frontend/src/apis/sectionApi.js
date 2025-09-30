import { api } from "./axios.js";

export async function addSection(testId) {
	try {
		const { data } = await api.post("/sections", {
			testId,
		});
		return data.section;
	} catch (err) {
		console.log(err.message);
		throw err;
	}
}

export async function deleteSection(sectionId) {
	try {
		await api.delete(`/sections/${sectionId}`);
	} catch (err) {
		console.log(err);
		throw err;
	}
}
