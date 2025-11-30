import { api } from "./axios";

const tagApi = {
	getAll: async (params) => {
		const { data } = await api.get("/tags", { params });
		return data;
	},
};

export default tagApi;
