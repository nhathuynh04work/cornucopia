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
	getLibrary: async () => {
		const { data } = await api.get("/users/me/library");
		return data;
	},
	updateUser: async ({ userId, data: updates }) => {
		const { data } = await api.patch(`/users/${userId}`, updates);
		return data.user;
	},
};

export default userApi;
