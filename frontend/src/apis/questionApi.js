import { api } from "./axios.js";

export async function addSingleQuestion(sectionId, questionType) {
	try {
		const { data } = await api.post("/questions/single", {
			sectionId,
			questionType,
		});
		return data;
	} catch (err) {
		console.log(err.message);
		throw err;
	}
}

export async function addOptionToQuestion(questionId) {
	try {
		const { data } = await api.post(`/questions/${questionId}/options`);
		return data.option;
	} catch (err) {
		console.log(err.message);
		throw err;
	}
}
