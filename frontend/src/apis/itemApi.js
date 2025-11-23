import { api } from "./axios";

const itemApi = {
	remove: async (id) => {
		const { data } = await api.delete(`/items/${id}`);
		return data.test;
	},
	update: async (id, changes) => {
		const { data } = await api.patch(`/items/${id}`, changes);
		return data.test;
	},
	addOption: async (id) => {
		const { data } = await api.post(`items/${id}/options`);
		return data.test;
	},
};

export default itemApi;
