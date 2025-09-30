import { api } from "./axios.js";

export async function addNormalGroup(sectionId) {
	try {
		const { data } = await api.post("/groups", {
			sectionId,
		});
		return data.group;
	} catch (err) {
		console.log(err.message);
		throw err;
	}
}

export async function addQuestionToGroup(groupId, questionType) {
	try {
		const { data } = await api.post(`/groups/${groupId}/questions`, {
			questionType,
		});
		return data.question;
	} catch (err) {
		console.log(err.message);
		throw err;
	}
}

export async function deleteGroup(groupId) {
	try {
		await api.delete(`/groups/${groupId}`);
	} catch (err) {
		console.log(err.message);
		throw err;
	}
}
