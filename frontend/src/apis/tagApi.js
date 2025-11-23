import { api } from "./axios";

const tagApi = {
	getAll: async () => {
		const { data } = await api.get(`/tags`);
		return data.tags;
	},
};

export default tagApi;