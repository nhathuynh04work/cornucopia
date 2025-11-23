import { api } from "./axios";

const authApi = {
	signup: async (input) => {
		const { data } = await api.post("/auth/signup", input);
		return data.message;
	},
	login: async (credentials) => {
		const { data } = await api.post("/auth/login", credentials);
		return data.token;
	},
	getMe: async () => {
		const { data } = await api.get("/auth/me");
		return data.user;
	},
	confirmEmail: async (confirmToken) => {
		const { data } = await api.get("/auth/confirm", {
			params: { token: confirmToken },
		});
		return data.token;
	},
};

export default authApi;
