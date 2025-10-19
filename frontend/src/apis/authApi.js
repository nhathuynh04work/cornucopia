import { api } from "./axios";

export async function signup(input) {
	const { data } = await api.post("/auth/signup", input);
	return data.message;
}

export async function login(credentials) {
	const { data } = await api.post("/auth/login", credentials);
	return data.token;
}

export async function getMe() {
	const { data } = await api.get("/auth/me");
	return data.user;
}

export async function confirmEmail(confirmToken) {
	const { data } = await api.get("/auth/confirm", {
		params: { token: confirmToken },
	});
	return data.token;
}
