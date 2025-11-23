import { api } from "./axios";

const optionApi = {
	update: async (id, changes) => {
		const { data } = await api.patch(`/options/${id}`, changes);
		return data.test;
	},
	remove: async (id) => {
		const { data } = await api.delete(`/options/${id}`);
		return data.test;
	},
};

export default optionApi;