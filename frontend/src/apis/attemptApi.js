import { api } from "./axios";

export async function createAttempt(payload) {
	const { data } = await api.post("/attempts", payload);
	return data.attempt;
}

export async function getAttemptResult(id) {
	const { data } = await api.get(`/attempts/${id}/results`);
	return data.result;
}
