import { api } from "./axios";

const attemptApi = {
	create: async (payload) => {
		const { data } = await api.post("/attempts", payload);
		return data.attempt;
	},
	getResult: async (id) => {
		const { data } = await api.get(`/attempts/${id}/results`);
		return data.result;
	},
};

export default attemptApi;
