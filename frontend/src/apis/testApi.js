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
