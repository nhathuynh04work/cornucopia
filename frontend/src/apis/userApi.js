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
	getUserProfile: async (userId) => {
		const { data } = await api.get(`/users/${userId}/profile`);
		return data;
	},
	updateUser: async ({ userId, data: updates }) => {
		const { data } = await api.patch(`/users/${userId}`, updates);
		return data.user;
	},
	updateSelf: async (updates) => {
		const { data } = await api.patch("/users/me", updates);
		return data.user;
	},
};

export default userApi;
