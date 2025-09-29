import { api } from "./axios.js";

export async function addNormalGroup(sectionId) {
	try {
		const { data } = await api.post("/groups", {
			sectionId,
		});
		return data.group;
	} catch (err) {
		console.log(err);
		throw err;
	}
}
