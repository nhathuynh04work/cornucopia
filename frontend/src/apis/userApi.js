import { api } from "./axios";

export async function getUsers(params) {
	const { data } = await api.get("/users", { params });
	return data; // { users, total, page, totalPages }
}
