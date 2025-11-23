import { api } from "./axios";

const userApi = {
	getUsers: async (params) => {
		const { data } = await api.get("/users", { params });
		return data;
	},
	updateInfo: async ({ userId, payload }) => {
		const { data } = await api.patch(`/users/${userId}`, payload);
		return data.user;
	},
	updateRole: async ({ userId, role }) => {
		const { data } = await api.patch(`/users/${userId}/role`, { role });
		return data.user;
	},
	getDashboardData: async () => {
		const { data } = await api.get("/users/me/dashboard");
		return data.data;
	},
};

export default userApi;
