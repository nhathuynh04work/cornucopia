import { api } from "./axios.js";

export async function fetchTests() {
	try {
		const { data } = await api.get("/tests");
		return data.tests;
	} catch (err) {
		console.log(err.message);
		throw err;
	}
}

export async function fetchTestBasicInfo(id) {
	try {
		const { data } = await api.get(`/tests/${id}`);
		return data.test;
	} catch (err) {
		console.log(err.message);
		throw err;
	}
}

export async function fetchTestDetails(id) {
	try {
		const { data } = await api.get(`/tests/${id}/full`);
		return data.test;
	} catch (err) {
		console.log(err.message);
		throw err;
	}
}

export async function createTest({ title, description }) {
	const { data } = await api.post("/tests", { title, description });
	return data.test;
}
