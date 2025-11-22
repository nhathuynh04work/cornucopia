import { api } from "./axios.js";

export async function getTests() {
	const { data } = await api.get("/tests");
	return data.tests;
}

export async function getAttemptedTests() {
	const { data } = await api.get("/tests/attempted");
	return data.tests;
}

export async function getMyTests() {
	const { data } = await api.get("/tests/admin");
	return data.tests;
}

export async function getTestForInfoView(id) {
	const { data } = await api.get(`/tests/${id}/info`);
	return data.test;
}

export async function getTestForEdit(id) {
	const { data } = await api.get(`/tests/${id}/edit`);
	return data.test;
}

export async function getTestForAttempt(id) {
	const { data } = await api.get(`/tests/${id}/attempt`);
	return data.test;
}

export async function getAttemptHistory(testId) {
	const { data } = await api.get(`/tests/${testId}/attempts`);
	return data.attempts;
}

export async function create(payload) {
	const { data } = await api.post("/tests", payload);
	return data.test;
}

export async function update(id, changes) {
	const { data } = await api.patch(`/tests/${id}`, changes);
	return data.test;
}

export async function remove(id) {
	await api.delete(`/tests/${id}`);
}

export async function addItem(testId, payload) {
	const { data } = await api.post(`/tests/${testId}/items`, payload);
	return data.item;
}
