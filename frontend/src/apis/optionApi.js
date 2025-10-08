import { api } from "./axios";

export async function deleteOption(id) {
	try {
		await api.delete(`/options/${id}`);
	} catch (err) {
		console.log(err.message);
		throw err;
	}
}
