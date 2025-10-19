import { api } from "./axios.js";

export async function fetchTests() {
	const { data } = await api.get("/tests");
	return data.tests;
}

export async function fetchTestBasicInfo(id) {
	const { data } = await api.get(`/tests/${id}`);
	return data.test;
}

export async function fetchTestDetails(id) {
	const { data } = await api.get(`/tests/${id}/full`);
	return data.test;
}

export async function createTest({ title, description }) {
	const { data } = await api.post("/tests", { title, description });
	return data.test;
}

export async function updateTest(id, changes) {
	const { data } = await api.patch(`/tests/${id}`, changes);
	return data.test;
}
