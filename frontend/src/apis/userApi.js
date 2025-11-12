import { api } from "./axios";

export async function getUsers(params) {
	const { data } = await api.get("/users", { params });
	return data; // { users, total, page, totalPages }
}

export async function updateRole({userId, role}) {
	const { data } = await api.patch(`/users/${userId}`, { role });
	return data.user;
}
