import { api } from "./axios.js";

export async function fetchTests() {
	const { data } = await api.get("/tests");
	return data.tests;
}

export async function fetchAttemptedTests() {
	const { data } = await api.get("/tests/attempted");
	return data.tests;
}

export async function fetchMyTests() {
	const { data } = await api.get("/tests/admin");
	return data.tests;
}

export async function fetchTestBasicInfo(id) {
	const { data } = await api.get(`/tests/${id}/info`);
	return data.test;
}

export async function fetchTestDetails(id) {
	const { data } = await api.get(`/tests/${id}/edit`);
	return data.test;
}

export async function fetchTestForAttempt(id) {
	const { data } = await api.get(`/tests/${id}/attempt`);
	return data.test;
}

export async function fetchTestAttemptsHistory(testId) {
	const { data } = await api.get(`/tests/${testId}/attempts`);
	return data.attempts;
}

export async function create(input) {
	const { data } = await api.post("/tests", input);
	return data.test;
}

export async function update(id, changes) {
	const { data } = await api.patch(`/tests/${id}`, changes);
	return data.test;
}

export async function remove(id) {
	await api.delete(`/tests/${id}`);
}

export async function addItem(testId, input) {
	const { data } = await api.post(`/tests/${testId}/items`, input);
	return data.item;
}
