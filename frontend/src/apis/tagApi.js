import { api } from "./axios";

const tagApi = {
	getAll: async ({ pageParam = 1 }) => {
		const { data } = await api.get("/tags", {
			params: { page: pageParam, limit: 15 },
		});
		return data;
	},
};

export default tagApi;
