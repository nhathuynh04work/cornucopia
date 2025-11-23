import { api } from "./axios";

const testApi = {
	getAll: async (params) => {
		const { data } = await api.get("/tests", { params });
		return data.tests;
	},
	getAttempted: async (params) => {
		const { data } = await api.get("/tests/attempted", { params });
		return data.tests;
	},
	getForInfoView: async (id) => {
		const { data } = await api.get(`/tests/${id}/info`);
		return data.test;
	},
	getForEdit: async (id) => {
		const { data } = await api.get(`/tests/${id}/edit`);
		console.log(data);
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
	getMyTests: async () => {
		const { data } = await api.get("/tests/admin");
		return data.tests;
	},
	create: async () => {
		const { data } = await api.post("/tests");
		return data.test;
	},
	update: async (id, changes) => {
		const { data } = await api.patch(`/tests/${id}`, changes);
		return data.test;
	},
	remove: async (id) => {
		await api.delete(`/tests/${id}`);
	},
	addItem: async (testId, payload) => {
		const { data } = await api.post(`/tests/${testId}/items`, payload);
		return data.item;
	},
};

export default testApi;
