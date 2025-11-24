import { api } from "./axios";

const userApi = {
	getUsers: async (params) => {
		const { data } = await api.get("/users", { params });
		return data;
	},
    getLandingData: async () => {
		const { data } = await api.get("/users/landing");
		return data.data;
	},
	updateRole: async ({ userId, role }) => {
		const { data } = await api.patch(`/users/${userId}/role`, { role });
		return data.user;
	},
};

export default userApi;
