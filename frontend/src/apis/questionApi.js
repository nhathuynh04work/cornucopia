import { api } from "./axios.js";

export async function addSingleQuestion(sectionId, questionType) {
	try {
		const { data } = await api.post("/questions/single", {
			sectionId,
			questionType,
		});
		return data;
	} catch (err) {
		console.log(err);
		throw err;
	}
}
