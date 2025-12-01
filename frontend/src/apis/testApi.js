import { api } from "./axios";

const testApi = {
	getAll: async (params) => {
		const { data } = await api.get("/tests", { params });
		return data;
	},
	getAttemptedTests: async (params) => {
		const { data } = await api.get("/tests/attempted", { params });
		return data;
	},
	getById: async (id) => {
		const { data } = await api.get(`/tests/${id}/info`);
		return data.test;
	},
	getForEdit: async (id) => {
		const { data } = await api.get(`/tests/${id}/edit`);
		return data.test;
	},
	getForAttempt: async (id) => {
		const { data } = await api.get(`/tests/${id}/attempt`);
		return data.test;
	},
	getAttemptHistory: async (testId) => {
		const { data } = await api.get(`/tests/${testId}/attempts`);
		return data.attempts;
	},
	create: async () => {
		const { data } = await api.post("/tests");
		return data.test;
	},
	sync: async (id, payload) => {
		const { data } = await api.patch(`/tests/${id}/sync`, payload);
		return data.test;
	},
	delete: async (id) => {
		await api.delete(`/tests/${id}`);
	},
};

export default testApi;
