import { api } from "./axios.js";

export async function addSection(testId) {
	try {
		const { data } = await api.post("/sections", {
			testId,
			title: "Default",
		});
		return data.section;
	} catch (err) {
		console.log(err);
		throw err;
	}
}
